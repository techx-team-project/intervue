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
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface.EntitlementGrant;
import java.util.List;
import lombok.RequiredArgsConstructor;
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

        int cost = price.getCreditCost() * request.quantity();
        if (entitlementService.remainingOf(companyId, EntitlementType.CREDIT) < cost) {
            throw new AppException(ErrorCode.INSUFFICIENT_CREDITS);
        }

        entitlementService.consumeUnits(
                companyId, EntitlementType.CREDIT, cost, "Đổi lấy " + price.getLabel());
        entitlementService.grant(
                companyId,
                recruiterId,
                List.of(
                        new EntitlementGrant(
                                null,
                                price.getEntitlementType(),
                                request.quantity(),
                                price.getTier(),
                                price.getDurationDays(),
                                price.getLabel())));

        return render(companyId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CreditLedgerEntryResource> ledger(Long recruiterId) {
        Long companyId = companyResolver.requireId(recruiterId);
        return entitlementService.ledgerOf(companyId, EntitlementType.CREDIT).stream()
                .map(
                        entry ->
                                new CreditLedgerEntryResource(
                                        entry.credit(),
                                        entry.quantity(),
                                        entry.label(),
                                        entry.at()))
                .toList();
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
