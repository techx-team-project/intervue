package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.CartItem;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.entities.Voucher;
import com.techx.intervue.modules.billing.entities.VoucherRedemption;
import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import com.techx.intervue.modules.billing.enums.VoucherStatus;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.billing.repositories.VoucherRedemptionRepository;
import com.techx.intervue.modules.billing.repositories.VoucherRepository;
import com.techx.intervue.modules.billing.requests.ValidateVoucherRequest;
import com.techx.intervue.modules.billing.resources.VoucherPreviewResource;
import com.techx.intervue.modules.billing.services.interfaces.VoucherServiceInterface;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VoucherService implements VoucherServiceInterface {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    private final VoucherRepository voucherRepository;
    private final VoucherRedemptionRepository redemptionRepository;
    private final CartLineReader cartLineReader;
    private final ServicePackageRepository packageRepository;
    private final RecruiterCompanyResolver companyResolver;

    @Override
    @Transactional(readOnly = true)
    public VoucherPreviewResource validate(ValidateVoucherRequest request, Long recruiterId) {
        Long companyId = companyResolver.requireId(recruiterId);
        long subtotal = subtotalOf(request, recruiterId);
        AppliedVoucher applied = apply(request.code(), subtotal, companyId);
        Voucher voucher = applied.voucher();

        return VoucherPreviewResource.builder()
                .code(voucher.getCode())
                .label(voucher.getLabel())
                .description(voucher.getDescription())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .discountAmount(applied.discountAmount())
                .subtotal(subtotal)
                .subtotalAfterDiscount(subtotal - applied.discountAmount())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AppliedVoucher apply(String code, long subtotal, Long companyId) {
        Voucher voucher =
                voucherRepository
                        .findByCode(code.trim().toUpperCase())
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        Instant now = Instant.now();
        if (voucher.getStatus() != VoucherStatus.ACTIVE
                || (voucher.getStartsAt() != null && voucher.getStartsAt().isAfter(now))
                || (voucher.getEndsAt() != null && voucher.getEndsAt().isBefore(now))) {
            throw new AppException(ErrorCode.VOUCHER_NOT_USABLE);
        }
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new AppException(ErrorCode.VOUCHER_EXHAUSTED);
        }
        if (voucher.getPerCompanyLimit() != null
                && redemptionRepository.countByVoucherIdAndCompanyId(voucher.getId(), companyId)
                        >= voucher.getPerCompanyLimit()) {
            throw new AppException(ErrorCode.VOUCHER_ALREADY_USED);
        }
        if (subtotal < voucher.getMinOrderValue()) {
            throw new AppException(ErrorCode.VOUCHER_MIN_ORDER_NOT_MET);
        }

        return new AppliedVoucher(voucher, discountFor(voucher, subtotal));
    }

    @Override
    @Transactional
    public void claim(AppliedVoucher applied, Long orderId, Long companyId) {
        if (voucherRepository.claim(applied.voucher().getId()) == 0) {
            throw new AppException(ErrorCode.VOUCHER_EXHAUSTED);
        }
        redemptionRepository.save(
                VoucherRedemption.builder()
                        .voucherId(applied.voucher().getId())
                        .orderId(orderId)
                        .companyId(companyId)
                        .discountAmount(applied.discountAmount())
                        .build());
    }

    @Override
    @Transactional
    public void release(Long orderId) {
        redemptionRepository
                .findByOrderId(orderId)
                .ifPresent(
                        redemption -> {
                            voucherRepository.release(redemption.getVoucherId());
                            redemptionRepository.delete(redemption);
                        });
    }

    private long discountFor(Voucher voucher, long subtotal) {
        long discount =
                voucher.getDiscountType() == VoucherDiscountType.FIXED
                        ? voucher.getDiscountValue()
                        : BigDecimal.valueOf(subtotal)
                                .multiply(BigDecimal.valueOf(voucher.getDiscountValue()))
                                .divide(HUNDRED, 0, RoundingMode.HALF_UP)
                                .longValueExact();
        if (voucher.getMaxDiscount() != null) {
            discount = Math.min(discount, voucher.getMaxDiscount());
        }
        return Math.min(discount, subtotal);
    }

    private long subtotalOf(ValidateVoucherRequest request, Long recruiterId) {
        if (request.packageId() != null) {
            ServicePackage servicePackage =
                    packageRepository
                            .findById(request.packageId())
                            .orElseThrow(() -> new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE));
            int quantity = request.quantity() == null ? 1 : request.quantity();
            return servicePackage.getPrice() * quantity;
        }

        List<CartItem> items = cartLineReader.read(recruiterId, request.cartItemIds());
        if (items.isEmpty()) {
            throw new AppException(ErrorCode.CART_EMPTY);
        }
        return items.stream()
                .mapToLong(item -> item.getServicePackage().getPrice() * item.getQuantity())
                .sum();
    }
}
