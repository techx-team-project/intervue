package com.techx.intervue.modules.ads.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.entities.AdSlot;
import com.techx.intervue.modules.ads.mappers.AdMapper;
import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.ads.requests.SaveAdSlotRequest;
import com.techx.intervue.modules.ads.resources.AdSlotResource;
import com.techx.intervue.modules.ads.services.interfaces.AdPackageLookupPortInterface;
import com.techx.intervue.modules.ads.services.interfaces.AdminAdSlotServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminAdSlotService implements AdminAdSlotServiceInterface {

    private final AdSlotRepository slotRepository;
    private final AdPackageLookupPortInterface packageLookup;
    private final AdMapper adMapper;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public List<AdSlotResource> list() {
        return slotRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(slot -> adMapper.toSlotResource(slot, slugOf(slot)))
                .toList();
    }

    @Override
    @Transactional
    public AdSlotResource update(Long id, SaveAdSlotRequest request, RequestActor actor) {
        AdSlot slot =
                slotRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.AD_SLOT_NOT_FOUND));

        slot.setName(request.name().trim());
        slot.setDescription(request.description());
        slot.setPricePerWeek(request.pricePerWeek());
        slot.setHouseImageUrl(request.houseImageUrl());
        slot.setHouseTargetUrl(request.houseTargetUrl());
        slot.setIsActive(request.active());
        slot.setDisplayOrder(request.displayOrder());
        AdSlot saved = slotRepository.save(slot);

        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(AuditAction.AD_SLOT_UPDATED)
                        .targetType(AuditTargetType.AD_SLOT)
                        .targetId(saved.getId())
                        .detail(saved.getCode())
                        .build());

        return adMapper.toSlotResource(saved, slugOf(saved));
    }

    private String slugOf(AdSlot slot) {
        return packageLookup.slugOf(slot.getServicePackageId()).orElse(null);
    }
}
