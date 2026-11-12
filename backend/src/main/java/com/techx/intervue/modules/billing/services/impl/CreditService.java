package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.CreditPrice;
import com.techx.intervue.modules.billing.mappers.CreditPriceMapper;
import com.techx.intervue.modules.billing.repositories.CreditPriceRepository;
import com.techx.intervue.modules.billing.requests.ConvertCreditsRequest;
import com.techx.intervue.modules.billing.resources.CreditLedgerEntryResource;
import com.techx.intervue.modules.billing.resources.CreditWalletResource;
import com.techx.intervue.modules.billing.services.interfaces.CreditServiceInterface;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface.ConsumeResult;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface.EntitlementGrant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreditService implements CreditServiceInterface {

    private final CreditPriceRepository priceRepository;
    private final CreditPriceMapper priceMapper;
    private final EntitlementServiceInterface entitlementService;
    private final RecruiterCompanyResolver companyResolver;

    @Override
    @Transactional(readOnly = true)
    public CreditWalletResource getWallet(Long recruiterId) {
        return render(companyResolver.requireId(recruiterId));
    }

    @Override
    @Transactional
    public CreditWalletResource convert(Long recruiterId, ConvertCreditsRequest request) {
        Long companyId = companyResolver.requireId(recruiterId);
        CreditPrice price =
                priceRepository
                        .findByEntitlementTypeAndTier(request.entitlementType(), request.tier())
                        .filter(found -> Boolean.TRUE.equals(found.getIsActive()))
                        .orElseThrow(() -> new AppException(ErrorCode.CREDIT_PRICE_NOT_AVAILABLE));

        int cost;
        try {
            cost = Math.multiplyExact(price.getCreditCost(), request.quantity());
        } catch (ArithmeticException ex) {
            throw AppException.validation(
                    "quantity", "Total credit cost exceeds the supported limit.");
        }
        if (entitlementService.remainingOf(companyId, EntitlementType.CREDIT) < cost) {
            throw new AppException(ErrorCode.INSUFFICIENT_CREDITS);
        }

        ConsumeResult consumed =
                entitlementService.consumeUnits(
                        companyId,
                        EntitlementType.CREDIT,
                        cost,
                        "Đổi lấy " + price.getLabel(),
                        recruiterId);
        entitlementService.grant(
                companyId,
                recruiterId,
                List.of(
                        EntitlementGrant.direct(
                                price.getEntitlementType(),
                                request.quantity(),
                                price.getTier(),
                                price.getDurationDays(),
                                price.getLabel(),
                                consumed.earliestDeadline())));

        return render(companyId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CreditLedgerEntryResource> ledger(Long recruiterId, Pageable pageable) {
        Long companyId = companyResolver.requireId(recruiterId);
        return entitlementService
                .ledgerOf(companyId, EntitlementType.CREDIT, pageable)
                .map(
                        entry ->
                                new CreditLedgerEntryResource(
                                        entry.credit(),
                                        entry.quantity(),
                                        entry.label(),
                                        entry.at()));
    }

    private CreditWalletResource render(Long companyId) {
        return CreditWalletResource.builder()
                .balance(entitlementService.remainingOf(companyId, EntitlementType.CREDIT))
                .nearestExpiryAt(
                        entitlementService
                                .nearestExpiryOf(companyId, EntitlementType.CREDIT)
                                .orElse(null))
                .prices(
                        priceRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc().stream()
                                .map(priceMapper::toResource)
                                .toList())
                .build();
    }
}
