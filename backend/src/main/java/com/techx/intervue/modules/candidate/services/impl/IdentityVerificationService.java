package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.application.config.ApplicationProperties;
import com.techx.intervue.modules.candidate.entities.IdentityVerification;
import com.techx.intervue.modules.candidate.enums.IdentityVerificationStatus;
import com.techx.intervue.modules.candidate.repositories.IdentityVerificationRepository;
import com.techx.intervue.modules.candidate.requests.SubmitIdentityVerificationRequest;
import com.techx.intervue.modules.candidate.resources.IdentityVerificationResource;
import com.techx.intervue.modules.candidate.services.interfaces.IdentityVerificationServiceInterface;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class IdentityVerificationService implements IdentityVerificationServiceInterface {

    private static final String FOLDER = "candidate-identity";
    private static final int MINIMUM_AGE = 16;
    private static final ZoneId ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final String QUEUE_LABEL = "Xác thực danh tính ứng viên";
    private static final String MANUAL_REVIEW_QUEUE_LABEL = "Yêu cầu duyệt thủ công danh tính";

    private final IdentityVerificationRepository repository;
    private final StorageServiceInterface storageService;
    private final UserServiceInterface userService;
    private final NotificationPublisherInterface notificationPublisher;
    private final TransactionTemplate transaction;
    private final ApplicationProperties properties;

    @Override
    @Transactional(readOnly = true)
    public IdentityVerificationResource findStatus(Long userId) {
        return repository
                .findByUserId(userId)
                .map(this::toResource)
                .orElseGet(
                        () ->
                                IdentityVerificationResource.builder()
                                        .attemptsLeft(IdentityVerification.DEFAULT_ATTEMPT_LIMIT)
                                        .canSubmit(true)
                                        .canRequestManualReview(false)
                                        .required(properties.requireIdentityVerification())
                                        .build());
    }

    // Not wrapped in one transaction: the storage upload is an external call.
    @Override
    public IdentityVerificationResource submit(
            Long userId,
            SubmitIdentityVerificationRequest request,
            MultipartFile front,
            MultipartFile back,
            MultipartFile selfie) {
        if (!userService.getMe(userId).emailVerified()) {
            throw new AppException(ErrorCode.EMAIL_NOT_VERIFIED);
        }
        requireMinimumAge(request.dateOfBirth());
        transaction.executeWithoutResult(
                status -> requireCanSubmit(repository.findByUserId(userId)));

        List<StoredFile> uploaded = new ArrayList<>();
        try {
            StoredFile frontFile = upload(front, uploaded);
            StoredFile backFile = upload(back, uploaded);
            StoredFile selfieFile = upload(selfie, uploaded);
            List<String> replaced = new ArrayList<>();
            IdentityVerification saved =
                    transaction.execute(
                            status ->
                                    persist(
                                            userId,
                                            request,
                                            frontFile,
                                            backFile,
                                            selfieFile,
                                            replaced));
            replaced.forEach(id -> storageService.delete(id, StorageTarget.IDENTITY_DOCUMENT));
            notifyAdmins(request.fullName().trim(), QUEUE_LABEL);
            return toResource(saved);
        } catch (RuntimeException e) {
            uploaded.forEach(
                    file ->
                            storageService.delete(
                                    file.publicId(), StorageTarget.IDENTITY_DOCUMENT));
            throw e;
        }
    }

    @Override
    @Transactional
    public IdentityVerificationResource requestManualReview(Long userId) {
        IdentityVerification verification =
                repository
                        .findByUserId(userId)
                        .filter(
                                existing ->
                                        existing.getStatus() == IdentityVerificationStatus.REJECTED
                                                && existing.attemptsLeft() == 0)
                        .orElseThrow(
                                () ->
                                        new AppException(
                                                ErrorCode.IDENTITY_MANUAL_REVIEW_UNAVAILABLE));
        if (verification.getManualReviewRequestedAt() != null) {
            throw new AppException(ErrorCode.IDENTITY_MANUAL_REVIEW_ALREADY_REQUESTED);
        }
        verification.setManualReviewRequestedAt(Instant.now());
        notifyAdmins(verification.getFullName(), MANUAL_REVIEW_QUEUE_LABEL);
        return toResource(verification);
    }

    private StoredFile upload(MultipartFile file, List<StoredFile> uploaded) {
        StoredFile stored = storageService.upload(file, StorageTarget.IDENTITY_DOCUMENT, FOLDER);
        uploaded.add(stored);
        return stored;
    }

    private IdentityVerification persist(
            Long userId,
            SubmitIdentityVerificationRequest request,
            StoredFile front,
            StoredFile back,
            StoredFile selfie,
            List<String> replaced) {
        IdentityVerification verification =
                repository
                        .findByUserId(userId)
                        .map(
                                existing -> {
                                    requireCanSubmit(Optional.of(existing));
                                    replaced.add(existing.getFrontPublicId());
                                    replaced.add(existing.getBackPublicId());
                                    replaced.add(existing.getSelfiePublicId());
                                    return existing;
                                })
                        .orElseGet(() -> IdentityVerification.builder().userId(userId).build());
        String idNumber = request.idNumber().trim();
        verification.setStatus(IdentityVerificationStatus.PENDING);
        verification.setFullName(request.fullName().trim());
        verification.setDateOfBirth(request.dateOfBirth());
        verification.setIdNumberHash(TokenHashUtil.sha256(idNumber));
        verification.setIdNumberLast4(idNumber.substring(idNumber.length() - 4));
        verification.setFrontPublicId(front.publicId());
        verification.setBackPublicId(back.publicId());
        verification.setSelfiePublicId(selfie.publicId());
        verification.setSubmittedAt(Instant.now());
        verification.setReviewedAt(null);
        verification.setReviewedBy(null);
        verification.setRejectReason(null);
        verification.setManualReviewRequestedAt(null);
        return repository.save(verification);
    }

    private void requireCanSubmit(Optional<IdentityVerification> existing) {
        if (existing.isEmpty()) {
            return;
        }
        IdentityVerification verification = existing.get();
        switch (verification.getStatus()) {
            case APPROVED -> throw new AppException(ErrorCode.IDENTITY_ALREADY_VERIFIED);
            case PENDING -> throw new AppException(ErrorCode.IDENTITY_REVIEW_PENDING);
            case REJECTED -> {
                if (verification.attemptsLeft() == 0) {
                    throw new AppException(ErrorCode.IDENTITY_ATTEMPTS_EXHAUSTED);
                }
            }
        }
    }

    private void requireMinimumAge(LocalDate dateOfBirth) {
        if (dateOfBirth.isAfter(LocalDate.now(ZONE).minusYears(MINIMUM_AGE))) {
            throw new AppException(ErrorCode.IDENTITY_UNDER_MINIMUM_AGE);
        }
    }

    private void notifyAdmins(String candidateName, String queueLabel) {
        List<NotificationCommand> commands =
                userService.findActiveIdsByRole(RoleType.ADMIN).stream()
                        .map(
                                adminId ->
                                        NotificationCommand.builder()
                                                .recipientType(RecipientType.USER)
                                                .recipientId(adminId)
                                                .type(NotificationType.ADMIN_REVIEW_QUEUE_ITEM)
                                                .params(
                                                        Map.of(
                                                                "companyName", candidateName,
                                                                "queueLabel", queueLabel))
                                                .actionUrl("/admin/verification/identity")
                                                .build())
                        .toList();
        notificationPublisher.publishAll(commands);
    }

    private IdentityVerificationResource toResource(IdentityVerification verification) {
        boolean rejected = verification.getStatus() == IdentityVerificationStatus.REJECTED;
        boolean canSubmit = rejected && verification.attemptsLeft() > 0;
        boolean canRequestManualReview =
                rejected
                        && verification.attemptsLeft() == 0
                        && verification.getManualReviewRequestedAt() == null;
        return IdentityVerificationResource.builder()
                .status(verification.getStatus())
                .rejectReason(verification.getRejectReason())
                .attemptsLeft(verification.attemptsLeft())
                .canSubmit(canSubmit)
                .canRequestManualReview(canRequestManualReview)
                .required(properties.requireIdentityVerification())
                .fullName(verification.getFullName())
                .idNumberLast4(verification.getIdNumberLast4())
                .submittedAt(verification.getSubmittedAt())
                .reviewedAt(verification.getReviewedAt())
                .manualReviewRequestedAt(verification.getManualReviewRequestedAt())
                .build();
    }
}
