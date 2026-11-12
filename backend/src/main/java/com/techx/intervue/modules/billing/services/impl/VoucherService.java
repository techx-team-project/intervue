package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.CartItem;
import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.entities.ServicePackage;
import com.techx.intervue.modules.billing.entities.Voucher;
import com.techx.intervue.modules.billing.entities.VoucherRedemption;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import com.techx.intervue.modules.billing.enums.VoucherStatus;
import com.techx.intervue.modules.billing.mappers.VoucherMapper;
import com.techx.intervue.modules.billing.repositories.ServicePackageRepository;
import com.techx.intervue.modules.billing.repositories.VoucherRedemptionRepository;
import com.techx.intervue.modules.billing.repositories.VoucherRepository;
import com.techx.intervue.modules.billing.requests.ValidateVoucherRequest;
import com.techx.intervue.modules.billing.resources.AvailableVoucherResource;
import com.techx.intervue.modules.billing.resources.UsedVoucherResource;
import com.techx.intervue.modules.billing.resources.VoucherPackageSummaryResource;
import com.techx.intervue.modules.billing.resources.VoucherPreviewResource;
import com.techx.intervue.modules.billing.services.interfaces.VoucherServiceInterface;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VoucherService implements VoucherServiceInterface {

    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);
    private static final int DEFAULT_WALLET_PAGE_SIZE = 12;
    private static final int MAX_WALLET_PAGE_SIZE = 48;
    private static final List<OrderStatus> EXCLUDED_USED_ORDER_STATUSES =
            List.of(OrderStatus.CANCELLED, OrderStatus.EXPIRED);

    private final VoucherRepository voucherRepository;
    private final VoucherRedemptionRepository redemptionRepository;
    private final CartLineReader cartLineReader;
    private final ServicePackageRepository packageRepository;
    private final RecruiterCompanyResolver companyResolver;
    private final VoucherMapper voucherMapper;

    @Override
    @Transactional(readOnly = true)
    public List<AvailableVoucherResource> listAvailable(Long recruiterId, Long packageId) {
        List<Voucher> active =
                voucherRepository.findAllAvailable(VoucherStatus.ACTIVE, Instant.now());
        if (active.isEmpty()) {
            return List.of();
        }
        Optional<Long> companyId = companyResolver.findId(recruiterId);
        List<Long> voucherIds = active.stream().map(Voucher::getId).toList();
        Map<Long, Long> usedByCompany = countUsedByCompany(companyId.orElse(null), voucherIds);
        Map<Long, List<VoucherPackageSummaryResource>> packagesByVoucher =
                voucherMapper.loadApplicablePackagesMap(voucherIds);

        return active.stream()
                .filter(
                        voucher -> {
                            long used = usedByCompany.getOrDefault(voucher.getId(), 0L);
                            if (voucher.getPerCompanyLimit() != null
                                    && used >= voucher.getPerCompanyLimit()) {
                                return false;
                            }
                            if (packageId == null) {
                                return true;
                            }
                            List<VoucherPackageSummaryResource> packages =
                                    packagesByVoucher.getOrDefault(voucher.getId(), List.of());
                            return packages.isEmpty()
                                    || packages.stream()
                                            .anyMatch(pkg -> pkg.id().equals(packageId));
                        })
                .map(
                        voucher ->
                                voucherMapper.toAvailableResource(
                                        voucher,
                                        usedByCompany.getOrDefault(voucher.getId(), 0L),
                                        packagesByVoucher.getOrDefault(voucher.getId(), List.of())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AvailableVoucherResource> listAvailableWallet(Long recruiterId, Pageable pageable) {
        Long companyId = companyResolver.findId(recruiterId).orElse(null);
        Pageable sanitized = sanitizeWalletPageable(pageable);
        Page<Voucher> page =
                voucherRepository.findAvailablePage(
                        VoucherStatus.ACTIVE, Instant.now(), companyId, sanitized);
        List<Long> voucherIds = page.getContent().stream().map(Voucher::getId).toList();
        Map<Long, Long> usedByCompany = countUsedByCompany(companyId, voucherIds);
        Map<Long, List<VoucherPackageSummaryResource>> packagesByVoucher =
                voucherMapper.loadApplicablePackagesMap(voucherIds);

        return page.map(
                voucher ->
                        voucherMapper.toAvailableResource(
                                voucher,
                                usedByCompany.getOrDefault(voucher.getId(), 0L),
                                packagesByVoucher.getOrDefault(voucher.getId(), List.of())));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UsedVoucherResource> listUsedWallet(Long recruiterId, Pageable pageable) {
        Pageable sanitized = sanitizeWalletPageable(pageable);
        Optional<Long> companyId = companyResolver.findId(recruiterId);
        if (companyId.isEmpty()) {
            return Page.empty(sanitized);
        }
        Page<Object[]> page =
                redemptionRepository.findUsedByCompany(
                        companyId.get(), EXCLUDED_USED_ORDER_STATUSES, sanitized);
        List<Long> voucherIds =
                page.getContent().stream()
                        .map(row -> ((Voucher) row[1]).getId())
                        .distinct()
                        .toList();
        Map<Long, List<VoucherPackageSummaryResource>> packagesByVoucher =
                voucherMapper.loadApplicablePackagesMap(voucherIds);

        return page.map(
                row -> {
                    VoucherRedemption redemption = (VoucherRedemption) row[0];
                    Voucher voucher = (Voucher) row[1];
                    Order order = (Order) row[2];
                    return voucherMapper.toUsedResource(
                            redemption,
                            voucher,
                            order,
                            packagesByVoucher.getOrDefault(voucher.getId(), List.of()));
                });
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherPreviewResource validate(ValidateVoucherRequest request, Long recruiterId) {
        Long companyId = companyResolver.requireId(recruiterId);
        List<BillableLine> lines = billableLinesOf(request, recruiterId);
        long subtotal = lines.stream().mapToLong(BillableLine::subtotal).sum();
        AppliedVoucher applied = apply(request.code(), lines, companyId);
        Voucher voucher = applied.voucher();

        return VoucherPreviewResource.builder()
                .code(voucher.getCode())
                .label(voucher.getLabel())
                .description(voucher.getDescription())
                .ribbonLabel(voucher.getRibbonLabel())
                .accentColor(voucherMapper.resolveAccentColor(voucher))
                .conditions(voucherMapper.readConditions(voucher.getConditionsJson()))
                .applicablePackages(
                        voucherMapper.toPackageSummaries(voucher.getApplicablePackages()))
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .discountAmount(applied.discountAmount())
                .subtotal(subtotal)
                .subtotalAfterDiscount(subtotal - applied.discountAmount())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AppliedVoucher previewForCheckout(String code, List<BillableLine> lines) {
        Voucher voucher =
                voucherRepository
                        .findByCodeWithPackages(code.trim().toUpperCase())
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        assertWithinActiveWindow(voucher);
        long eligibleSubtotal = computeEligibleSubtotal(voucher, lines);
        if (eligibleSubtotal < voucher.getMinOrderValue()) {
            throw new AppException(ErrorCode.VOUCHER_MIN_ORDER_NOT_MET);
        }

        return new AppliedVoucher(voucher, discountFor(voucher, eligibleSubtotal));
    }

    @Override
    @Transactional(readOnly = true)
    public void assertUsableForCompany(Voucher voucher, Long companyId) {
        if (voucher.getUsageLimit() != null && voucher.getUsedCount() >= voucher.getUsageLimit()) {
            throw new AppException(ErrorCode.VOUCHER_EXHAUSTED);
        }
        if (voucher.getPerCompanyLimit() != null
                && redemptionRepository.countByVoucherIdAndCompanyId(voucher.getId(), companyId)
                        >= voucher.getPerCompanyLimit()) {
            throw new AppException(ErrorCode.VOUCHER_ALREADY_USED);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AppliedVoucher apply(String code, List<BillableLine> lines, Long companyId) {
        AppliedVoucher applied = previewForCheckout(code, lines);
        assertUsableForCompany(applied.voucher(), companyId);
        return applied;
    }

    @Override
    @Transactional
    public void claim(AppliedVoucher applied, Long orderId, Long companyId) {
        Voucher lockedVoucher =
                voucherRepository
                        .findByIdForUpdate(applied.voucher().getId())
                        .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
        assertWithinActiveWindow(lockedVoucher);

        // Lock company redemptions with a current read so concurrent checkouts cannot slip past
        // perCompanyLimit under MySQL REPEATABLE_READ MVCC snapshots.
        if (lockedVoucher.getPerCompanyLimit() != null
                && redemptionRepository
                                .findIdsForCompanyUpdate(lockedVoucher.getId(), companyId)
                                .size()
                        >= lockedVoucher.getPerCompanyLimit()) {
            throw new AppException(ErrorCode.VOUCHER_ALREADY_USED);
        }
        if (voucherRepository.claim(lockedVoucher.getId()) == 0) {
            throw new AppException(ErrorCode.VOUCHER_EXHAUSTED);
        }
        redemptionRepository.saveAndFlush(
                VoucherRedemption.builder()
                        .voucherId(lockedVoucher.getId())
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
                            if (redemptionRepository.deleteByOrderIdAtomic(orderId) > 0) {
                                voucherRepository.release(redemption.getVoucherId());
                            }
                        });
    }

    private void assertWithinActiveWindow(Voucher voucher) {
        Instant now = Instant.now();
        if (voucher.getStatus() != VoucherStatus.ACTIVE
                || (voucher.getStartsAt() != null && voucher.getStartsAt().isAfter(now))
                || (voucher.getEndsAt() != null && !voucher.getEndsAt().isAfter(now))) {
            throw new AppException(ErrorCode.VOUCHER_NOT_USABLE);
        }
    }

    private Map<Long, Long> countUsedByCompany(Long companyId, Collection<Long> voucherIds) {
        if (companyId == null || voucherIds.isEmpty()) {
            return Map.of();
        }
        Map<Long, Long> usedByCompany = new HashMap<>();
        for (Object[] row : redemptionRepository.countByCompanyGrouped(companyId, voucherIds)) {
            usedByCompany.put(((Number) row[0]).longValue(), ((Number) row[1]).longValue());
        }
        return usedByCompany;
    }

    private long computeEligibleSubtotal(Voucher voucher, List<BillableLine> lines) {
        Set<Long> allowedPackageIds =
                voucher.getApplicablePackages().stream()
                        .map(ServicePackage::getId)
                        .collect(Collectors.toSet());
        if (allowedPackageIds.isEmpty()) {
            return lines.stream().mapToLong(BillableLine::subtotal).sum();
        }
        long eligibleSubtotal = 0L;
        boolean matchedAnyPackage = false;
        for (BillableLine line : lines) {
            if (allowedPackageIds.contains(line.packageId())) {
                matchedAnyPackage = true;
                eligibleSubtotal += line.subtotal();
            }
        }
        if (!matchedAnyPackage) {
            throw new AppException(ErrorCode.VOUCHER_NOT_APPLICABLE);
        }
        return eligibleSubtotal;
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

    private List<BillableLine> billableLinesOf(ValidateVoucherRequest request, Long recruiterId) {
        if (request.packageId() != null) {
            ServicePackage servicePackage =
                    packageRepository
                            .findById(request.packageId())
                            .orElseThrow(() -> new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE));
            if (!servicePackage.isAvailableInCatalog()) {
                throw new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE);
            }
            int quantity = request.quantity() == null ? 1 : request.quantity();
            return List.of(
                    new BillableLine(servicePackage.getId(), servicePackage.getPrice() * quantity));
        }

        List<CartItem> items = cartLineReader.read(recruiterId, request.cartItemIds());
        if (items.isEmpty()) {
            throw new AppException(ErrorCode.CART_EMPTY);
        }
        return items.stream()
                .map(
                        item -> {
                            ServicePackage servicePackage = item.getServicePackage();
                            if (!servicePackage.isAvailableInCatalog()) {
                                throw new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE);
                            }
                            return new BillableLine(
                                    servicePackage.getId(),
                                    servicePackage.getPrice() * item.getQuantity());
                        })
                .toList();
    }

    private Pageable sanitizeWalletPageable(Pageable pageable) {
        if (pageable == null || pageable.isUnpaged()) {
            return PageRequest.of(0, DEFAULT_WALLET_PAGE_SIZE);
        }
        int page = Math.max(0, pageable.getPageNumber());
        int rawSize = pageable.getPageSize();
        int size =
                rawSize <= 0 ? DEFAULT_WALLET_PAGE_SIZE : Math.min(rawSize, MAX_WALLET_PAGE_SIZE);
        return PageRequest.of(page, size);
    }
}
