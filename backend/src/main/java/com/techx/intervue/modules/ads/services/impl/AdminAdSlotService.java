package com.techx.intervue.modules.ads.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ads.entities.AdSlot;
import com.techx.intervue.modules.ads.mappers.AdMapper;
import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.ads.requests.CreateAdSlotRequest;
import com.techx.intervue.modules.ads.requests.SaveAdSlotRequest;
import com.techx.intervue.modules.ads.resources.AdSlotResource;
import com.techx.intervue.modules.ads.services.interfaces.AdPackageLookupPortInterface;
import com.techx.intervue.modules.ads.services.interfaces.AdminAdSlotServiceInterface;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AdminAdSlotService implements AdminAdSlotServiceInterface {

    private static final String HOUSE_IMAGE_FOLDER = "ads/house";

    private final AdSlotRepository slotRepository;
    private final AdPackageLookupPortInterface packageLookup;
    private final AdMapper adMapper;
    private final AuditLogServiceInterface auditLogService;
    private final StorageServiceInterface storageService;

    @Override
    @Transactional(readOnly = true)
    public List<AdSlotResource> list() {
        return slotRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(slot -> adMapper.toSlotResource(slot, slugOf(slot)))
                .toList();
    }

    @Override
    @Transactional
    public AdSlotResource create(CreateAdSlotRequest request, RequestActor actor) {
        String code = request.code().trim().toUpperCase(Locale.ROOT);
        if (slotRepository.findByCode(code).isPresent()) {
            throw AppException.validation("code", "An ad slot with this code already exists");
        }
        String description = trimToNull(request.description());
        String houseImageUrl = normalizeUrl("houseImageUrl", request.houseImageUrl());
        String houseTargetUrl = normalizeUrl("houseTargetUrl", request.houseTargetUrl());
        boolean active = Boolean.TRUE.equals(request.active());

        Long packageId = resolvePackageId(code, request, description, active);
        AdSlot saved =
                slotRepository.save(
                        AdSlot.builder()
                                .code(code)
                                .name(request.name().trim())
                                .placement(request.placement().trim().toUpperCase(Locale.ROOT))
                                .description(description)
                                .width(request.width())
                                .height(request.height())
                                .pricePerWeek(request.pricePerWeek())
                                .servicePackageId(packageId)
                                .houseImageUrl(houseImageUrl)
                                .houseTargetUrl(houseTargetUrl)
                                .isActive(active)
                                .displayOrder(request.displayOrder())
                                .build());

        recordAudit(actor, AuditAction.AD_SLOT_CREATED, saved);
        return adMapper.toSlotResource(saved, slugOf(saved));
    }

    @Override
    @Transactional
    public AdSlotResource update(Long id, SaveAdSlotRequest request, RequestActor actor) {
        AdSlot slot =
                slotRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.AD_SLOT_NOT_FOUND));

        String houseImageUrl = normalizeUrl("houseImageUrl", request.houseImageUrl());
        String houseTargetUrl = normalizeUrl("houseTargetUrl", request.houseTargetUrl());
        boolean active = Boolean.TRUE.equals(request.active());

        slot.setName(request.name().trim());
        slot.setDescription(trimToNull(request.description()));
        slot.setPricePerWeek(request.pricePerWeek());
        slot.setHouseImageUrl(houseImageUrl);
        slot.setHouseTargetUrl(houseTargetUrl);
        slot.setIsActive(active);
        slot.setDisplayOrder(request.displayOrder());
        AdSlot saved = slotRepository.save(slot);
        packageLookup.syncPrice(saved.getServicePackageId(), saved.getPricePerWeek());
        packageLookup.syncAvailability(saved.getServicePackageId(), active);

        recordAudit(actor, AuditAction.AD_SLOT_UPDATED, saved);
        return adMapper.toSlotResource(saved, slugOf(saved));
    }

    @Override
    public UploadedHouseImageResource uploadHouseImage(MultipartFile file) {
        StoredFile stored = storageService.upload(file, StorageTarget.IMAGE, HOUSE_IMAGE_FOLDER);
        return new UploadedHouseImageResource(
                storageService.publicImageUrl(stored.publicId()), stored.publicId());
    }

    private Long resolvePackageId(
            String code, CreateAdSlotRequest request, String description, boolean active) {
        if (request.servicePackageId() == null) {
            return packageLookup.createBannerPackageForSlot(
                    code,
                    request.name(),
                    description,
                    request.pricePerWeek(),
                    active,
                    request.displayOrder());
        }
        if (!packageLookup.existsPackage(request.servicePackageId())) {
            throw new AppException(ErrorCode.PACKAGE_NOT_AVAILABLE);
        }
        if (slotRepository.findByServicePackageId(request.servicePackageId()).isPresent()) {
            throw AppException.validation(
                    "servicePackageId",
                    "This service package is already linked to another ad slot");
        }
        packageLookup.syncPrice(request.servicePackageId(), request.pricePerWeek());
        packageLookup.syncAvailability(request.servicePackageId(), active);
        return request.servicePackageId();
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeUrl(String field, String value) {
        String trimmed = trimToNull(value);
        if (trimmed == null) {
            return null;
        }
        if (!(trimmed.startsWith("https://")
                || trimmed.startsWith("http://")
                || trimmed.startsWith("/"))) {
            throw AppException.validation(
                    field, "Must be an http(s) URL or a relative path starting with /");
        }
        return trimmed;
    }

    private void recordAudit(RequestActor actor, AuditAction action, AdSlot slot) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.AD_SLOT)
                        .targetId(slot.getId())
                        .detail(slot.getCode())
                        .ip(actor.ip())
                        .build());
    }

    private String slugOf(AdSlot slot) {
        return packageLookup.slugOf(slot.getServicePackageId()).orElse(null);
    }
}
