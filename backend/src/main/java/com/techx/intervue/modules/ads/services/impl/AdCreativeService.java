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
import com.techx.intervue.modules.ads.entities.AdBooking;
import com.techx.intervue.modules.ads.entities.AdCreative;
import com.techx.intervue.modules.ads.entities.AdSlot;
import com.techx.intervue.modules.ads.enums.AdBookingStatus;
import com.techx.intervue.modules.ads.enums.AdCreativeStatus;
import com.techx.intervue.modules.ads.repositories.AdBookingRepository;
import com.techx.intervue.modules.ads.repositories.AdCreativeRepository;
import com.techx.intervue.modules.ads.repositories.AdSlotRepository;
import com.techx.intervue.modules.ads.requests.ReviewAdCreativeRequest;
import com.techx.intervue.modules.ads.requests.SaveAdCreativeRequest;
import com.techx.intervue.modules.ads.resources.AdminAdCreativeResource;
import com.techx.intervue.modules.ads.resources.RecruiterAdBookingResource;
import com.techx.intervue.modules.ads.services.interfaces.AdCreativeServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AdCreativeService implements AdCreativeServiceInterface {

    private static final String FOLDER = "ads/creatives";

    private final AdBookingRepository bookingRepository;
    private final AdCreativeRepository creativeRepository;
    private final AdSlotRepository slotRepository;
    private final StorageServiceInterface storageService;
    private final CompanyServiceInterface companyService;
    private final AdBookingPresenter presenter;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional
    public RecruiterAdBookingResource upload(
            Long bookingId, MultipartFile image, SaveAdCreativeRequest request, Long recruiterId) {
        Long companyId = companyService.findMyCompany(recruiterId).id();
        AdBooking booking =
                bookingRepository
                        .findById(bookingId)
                        .filter(found -> found.getCompanyId().equals(companyId))
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (booking.getStatus() != AdBookingStatus.BOOKED) {
            throw new AppException(ErrorCode.AD_BOOKING_NOT_READY);
        }

        StoredFile stored = storageService.upload(image, StorageTarget.IMAGE, FOLDER);
        AdCreative creative =
                creativeRepository.findByAdBookingId(bookingId).orElseGet(AdCreative::new);
        if (creative.getImagePublicId() != null) {
            storageService.delete(creative.getImagePublicId(), StorageTarget.IMAGE);
        }

        creative.setAdBookingId(bookingId);
        creative.setImagePublicId(stored.publicId());
        creative.setImageUrl(storageService.publicImageUrl(stored.publicId()));
        creative.setTargetUrl(request.targetUrl().trim());
        creative.setAltText(request.altText());
        // Every re-upload goes back through review; approving once must not approve everything
        // after
        creative.setStatus(AdCreativeStatus.PENDING);
        creative.setRejectionReason(null);
        creative.setReviewedByUserId(null);
        creative.setReviewedAt(null);
        creativeRepository.save(creative);

        return presenter.toResource(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminAdCreativeResource> search(AdCreativeStatus status, Pageable pageable) {
        Page<AdCreative> page =
                status == null
                        ? creativeRepository.findAllByOrderByCreatedAtDesc(pageable)
                        : creativeRepository.findAllByStatusOrderByCreatedAtAsc(status, pageable);
        return page.map(this::toAdminResource);
    }

    @Override
    @Transactional
    public AdminAdCreativeResource approve(Long id, RequestActor actor) {
        AdCreative creative = requirePending(id);
        creative.setStatus(AdCreativeStatus.APPROVED);
        creative.setRejectionReason(null);
        stamp(creative, actor);
        audit(actor, AuditAction.AD_CREATIVE_APPROVED, creative, "approved");
        return toAdminResource(creative);
    }

    @Override
    @Transactional
    public AdminAdCreativeResource reject(
            Long id, ReviewAdCreativeRequest request, RequestActor actor) {
        AdCreative creative = requirePending(id);
        creative.setStatus(AdCreativeStatus.REJECTED);
        creative.setRejectionReason(request.rejectionReason());
        stamp(creative, actor);
        audit(actor, AuditAction.AD_CREATIVE_REJECTED, creative, request.rejectionReason());
        return toAdminResource(creative);
    }

    private AdCreative requirePending(Long id) {
        AdCreative creative =
                creativeRepository
                        .findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (creative.getStatus() != AdCreativeStatus.PENDING) {
            throw new AppException(ErrorCode.AD_CREATIVE_ALREADY_REVIEWED);
        }
        return creative;
    }

    private void stamp(AdCreative creative, RequestActor actor) {
        creative.setReviewedByUserId(actor.userId());
        creative.setReviewedAt(Instant.now());
    }

    private void audit(RequestActor actor, AuditAction action, AdCreative creative, String detail) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.AD_CREATIVE)
                        .targetId(creative.getId())
                        .detail(detail)
                        .build());
    }

    private AdminAdCreativeResource toAdminResource(AdCreative creative) {
        AdBooking booking = bookingRepository.findById(creative.getAdBookingId()).orElse(null);
        AdSlot slot =
                booking == null
                        ? null
                        : slotRepository.findById(booking.getAdSlotId()).orElse(null);
        return AdminAdCreativeResource.builder()
                .id(creative.getId())
                .bookingId(creative.getAdBookingId())
                .slotCode(slot == null ? null : slot.getCode())
                .slotName(slot == null ? null : slot.getName())
                .width(slot == null ? null : slot.getWidth())
                .height(slot == null ? null : slot.getHeight())
                .companyId(booking == null ? null : booking.getCompanyId())
                .weekStart(booking == null ? null : booking.getWeekStart())
                .weekEnd(booking == null ? null : booking.getWeekStart().plusDays(6))
                .imageUrl(creative.getImageUrl())
                .targetUrl(creative.getTargetUrl())
                .altText(creative.getAltText())
                .status(creative.getStatus())
                .rejectionReason(creative.getRejectionReason())
                .reviewedAt(creative.getReviewedAt())
                .createdAt(creative.getCreatedAt())
                .build();
    }
}
