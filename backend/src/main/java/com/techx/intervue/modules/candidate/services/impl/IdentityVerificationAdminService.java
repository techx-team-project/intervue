package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.storage.FileType;
import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.candidate.entities.IdentityVerification;
import com.techx.intervue.modules.candidate.enums.IdentityVerificationStatus;
import com.techx.intervue.modules.candidate.repositories.IdentityVerificationRepository;
import com.techx.intervue.modules.candidate.requests.RejectIdentityVerificationRequest;
import com.techx.intervue.modules.candidate.requests.SearchIdentityVerificationRequest;
import com.techx.intervue.modules.candidate.resources.AdminIdentityVerificationResource;
import com.techx.intervue.modules.candidate.services.interfaces.IdentityVerificationAdminServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface.StoredDocumentContent;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IdentityVerificationAdminService implements IdentityVerificationAdminServiceInterface {

    private static final int GRANTED_ATTEMPTS = 3;
    private static final String ACTION_URL = "/candidate/identity-verification";

    private final IdentityVerificationRepository repository;
    private final StorageServiceInterface storageService;
    private final UserServiceInterface userService;
    private final NotificationPublisherInterface notificationPublisher;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminIdentityVerificationResource> search(
            SearchIdentityVerificationRequest request, Pageable pageable) {
        String keyword =
                request.q() == null || request.q().isBlank()
                        ? null
                        : "%" + request.q().trim().toLowerCase() + "%";
        Sort sort =
                request.status() == IdentityVerificationStatus.PENDING
                        ? Sort.by("submittedAt").ascending()
                        : Sort.by("submittedAt").descending();
        Page<IdentityVerification> page =
                repository.search(
                        request.status(),
                        keyword,
                        PageRequest.of(
                                pageable.getPageNumber(),
                                pageable.getPageSize(),
                                sort.and(Sort.by("id").descending())));
        Map<Long, UserResource> users =
                userService
                        .findByIds(page.map(IdentityVerification::getUserId).getContent())
                        .stream()
                        .collect(Collectors.toMap(UserResource::id, Function.identity()));
        return page.map(
                verification -> toResource(verification, users.get(verification.getUserId())));
    }

    @Override
    @Transactional(readOnly = true)
    public AdminIdentityVerificationResource findOne(Long id) {
        return toResource(require(id));
    }

    @Override
    @Transactional(readOnly = true)
    public StoredDocumentContent readDocument(Long id, DocumentSide side) {
        IdentityVerification verification = require(id);
        String publicId =
                switch (side) {
                    case FRONT -> verification.getFrontPublicId();
                    case BACK -> verification.getBackPublicId();
                    case SELFIE -> verification.getSelfiePublicId();
                };
        byte[] bytes = storageService.fetchDocument(publicId, StorageTarget.IDENTITY_DOCUMENT);
        FileType type = FileType.detect(bytes).orElse(FileType.JPEG);
        return new StoredDocumentContent(
                "identity_" + side.name().toLowerCase() + "." + type.extension(),
                type.contentType(),
                bytes);
    }

    @Override
    @Transactional
    public AdminIdentityVerificationResource approve(Long id, RequestActor actor) {
        IdentityVerification verification = requirePending(id);
        if (repository.existsByIdNumberHashAndUserIdNotAndStatus(
                verification.getIdNumberHash(),
                verification.getUserId(),
                IdentityVerificationStatus.APPROVED)) {
            throw new AppException(ErrorCode.IDENTITY_NUMBER_ALREADY_USED);
        }
        verification.setStatus(IdentityVerificationStatus.APPROVED);
        verification.setRejectReason(null);
        stamp(verification, actor);
        audit(actor, AuditAction.IDENTITY_VERIFICATION_APPROVED, verification, null);
        notifyCandidate(verification, NotificationType.IDENTITY_VERIFIED, Map.of());
        return toResource(verification);
    }

    @Override
    @Transactional
    public AdminIdentityVerificationResource reject(
            Long id, RejectIdentityVerificationRequest request, RequestActor actor) {
        IdentityVerification verification = requirePending(id);
        String reason = request.reason().trim();
        verification.setStatus(IdentityVerificationStatus.REJECTED);
        verification.setRejectReason(reason);
        verification.setRejectionCount(verification.getRejectionCount() + 1);
        stamp(verification, actor);
        audit(actor, AuditAction.IDENTITY_VERIFICATION_REJECTED, verification, reason);
        notifyCandidate(
                verification,
                NotificationType.IDENTITY_REJECTED,
                Map.of("reason", reason, "attemptsLeft", verification.attemptsLeft()));
        return toResource(verification);
    }

    @Override
    @Transactional
    public AdminIdentityVerificationResource grantAttempts(Long id, RequestActor actor) {
        IdentityVerification verification = require(id);
        if (verification.getStatus() != IdentityVerificationStatus.REJECTED
                || verification.attemptsLeft() > 0) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        verification.setAttemptLimit(verification.getAttemptLimit() + GRANTED_ATTEMPTS);
        audit(
                actor,
                AuditAction.IDENTITY_VERIFICATION_ATTEMPTS_GRANTED,
                verification,
                "Granted " + GRANTED_ATTEMPTS + " more attempts");
        return toResource(verification);
    }

    private IdentityVerification require(Long id) {
        return repository.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private IdentityVerification requirePending(Long id) {
        IdentityVerification verification = require(id);
        if (verification.getStatus() != IdentityVerificationStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }
        return verification;
    }

    private void stamp(IdentityVerification verification, RequestActor actor) {
        verification.setReviewedAt(Instant.now());
        verification.setReviewedBy(actor.userId());
    }

    private AdminIdentityVerificationResource toResource(IdentityVerification verification) {
        List<UserResource> users = userService.findByIds(List.of(verification.getUserId()));
        return toResource(verification, users.isEmpty() ? null : users.get(0));
    }

    private AdminIdentityVerificationResource toResource(
            IdentityVerification verification, UserResource user) {
        return AdminIdentityVerificationResource.builder()
                .id(verification.getId())
                .userId(verification.getUserId())
                .userEmail(user == null ? null : user.email())
                .fullName(verification.getFullName())
                .dateOfBirth(verification.getDateOfBirth())
                .idNumberLast4(verification.getIdNumberLast4())
                .status(verification.getStatus())
                .idNumberUsedByAnotherAccount(
                        repository.existsByIdNumberHashAndUserIdNotAndStatusIn(
                                verification.getIdNumberHash(),
                                verification.getUserId(),
                                IdentityVerificationStatus.HOLDING_ID_NUMBER))
                .rejectReason(verification.getRejectReason())
                .rejectionCount(verification.getRejectionCount())
                .attemptLimit(verification.getAttemptLimit())
                .submittedAt(verification.getSubmittedAt())
                .reviewedAt(verification.getReviewedAt())
                .build();
    }

    private void notifyCandidate(
            IdentityVerification verification, NotificationType type, Map<String, Object> params) {
        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.USER)
                        .recipientId(verification.getUserId())
                        .type(type)
                        .params(params)
                        .actionUrl(ACTION_URL)
                        .build());
    }

    private void audit(
            RequestActor actor,
            AuditAction action,
            IdentityVerification verification,
            String reason) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.IDENTITY_VERIFICATION)
                        .targetId(verification.getId())
                        .reason(reason)
                        .detail("Candidate " + verification.getUserId())
                        .ip(actor.ip())
                        .build());
    }
}
