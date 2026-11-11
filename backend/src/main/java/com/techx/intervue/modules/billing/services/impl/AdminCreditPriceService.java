package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.billing.entities.CreditPrice;
import com.techx.intervue.modules.billing.mappers.CreditPriceMapper;
import com.techx.intervue.modules.billing.repositories.CreditPriceRepository;
import com.techx.intervue.modules.billing.requests.CreateCreditPriceRequest;
import com.techx.intervue.modules.billing.requests.SaveCreditPriceRequest;
import com.techx.intervue.modules.billing.resources.CreditPriceResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminCreditPriceServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminCreditPriceService implements AdminCreditPriceServiceInterface {

    private final CreditPriceRepository priceRepository;
    private final CreditPriceMapper priceMapper;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public List<CreditPriceResource> list() {
        return priceRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(priceMapper::toResource)
                .toList();
    }

    @Override
    @Transactional
    public CreditPriceResource create(CreateCreditPriceRequest request, RequestActor actor) {
        EntitlementConfigRules.validateCreditPrice(
                request.entitlementType(), request.tier(), request.durationDays());
        if (priceRepository.existsByEntitlementTypeAndTier(
                request.entitlementType(), request.tier())) {
            throw new AppException(ErrorCode.DUPLICATE_CREDIT_PRICE);
        }

        CreditPrice price =
                CreditPrice.builder()
                        .entitlementType(request.entitlementType())
                        .tier(request.tier())
                        .build();
        applyFields(
                price,
                request.creditCost(),
                request.durationDays(),
                request.label(),
                request.active(),
                request.displayOrder());
        CreditPrice saved = priceRepository.save(price);
        audit(saved, AuditAction.CREDIT_PRICE_CREATED, actor);
        return priceMapper.toResource(saved);
    }

    @Override
    @Transactional
    public CreditPriceResource update(Long id, SaveCreditPriceRequest request, RequestActor actor) {
        CreditPrice price =
                priceRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.CREDIT_PRICE_NOT_AVAILABLE));

        EntitlementConfigRules.validateCreditPrice(
                price.getEntitlementType(), price.getTier(), request.durationDays());
        applyFields(
                price,
                request.creditCost(),
                request.durationDays(),
                request.label(),
                request.active(),
                request.displayOrder());
        CreditPrice saved = priceRepository.save(price);
        audit(saved, AuditAction.CREDIT_PRICE_UPDATED, actor);
        return priceMapper.toResource(saved);
    }

    private void applyFields(
            CreditPrice price,
            Integer creditCost,
            Integer durationDays,
            String label,
            Boolean active,
            Integer displayOrder) {
        price.setCreditCost(creditCost);
        price.setDurationDays(durationDays);
        price.setLabel(label.trim());
        price.setIsActive(active);
        price.setDisplayOrder(displayOrder);
    }

    private void audit(CreditPrice saved, AuditAction action, RequestActor actor) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.CREDIT_PRICE)
                        .targetId(saved.getId())
                        .detail(saved.getEntitlementType() + " tier " + saved.getTier())
                        .build());
    }
}
