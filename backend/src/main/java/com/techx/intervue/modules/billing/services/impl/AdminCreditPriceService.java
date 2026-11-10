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
    public CreditPriceResource update(Long id, SaveCreditPriceRequest request, RequestActor actor) {
        CreditPrice price =
                priceRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.CREDIT_PRICE_NOT_AVAILABLE));

        price.setCreditCost(request.creditCost());
        price.setDurationDays(request.durationDays());
        price.setLabel(request.label());
        price.setIsActive(request.active());
        price.setDisplayOrder(request.displayOrder());
        CreditPrice saved = priceRepository.save(price);

        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(AuditAction.CREDIT_PRICE_UPDATED)
                        .targetType(AuditTargetType.CREDIT_PRICE)
                        .targetId(saved.getId())
                        .detail(saved.getEntitlementType() + " tier " + saved.getTier())
                        .build());

        return priceMapper.toResource(saved);
    }
}
