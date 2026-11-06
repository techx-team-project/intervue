package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.entities.BusinessDocument;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyAgreement;
import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.entities.CompanyProfile;
import com.techx.intervue.modules.company.enums.AgreementAcceptanceMode;
import com.techx.intervue.modules.company.enums.AgreementScope;
import com.techx.intervue.modules.company.enums.AgreementStatus;
import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import com.techx.intervue.modules.company.enums.PublishRightLossCause;
import com.techx.intervue.modules.company.events.BusinessDocumentReviewedEvent;
import com.techx.intervue.modules.company.events.PublishRightLostEvent;
import com.techx.intervue.modules.company.mappers.AdminBusinessVerificationMapper;
import com.techx.intervue.modules.company.mappers.BusinessDocumentMapper;
import com.techx.intervue.modules.company.repositories.BusinessDocumentRepository;
import com.techx.intervue.modules.company.repositories.BusinessDocumentRepository.ReviewStatusCount;
import com.techx.intervue.modules.company.repositories.BusinessDocumentSpecifications;
import com.techx.intervue.modules.company.repositories.CompanyAgreementRepository;
import com.techx.intervue.modules.company.repositories.CompanyMemberRepository;
import com.techx.intervue.modules.company.repositories.CompanyProfileRepository;
import com.techx.intervue.modules.company.requests.ApproveDocumentRequest;
import com.techx.intervue.modules.company.requests.ReviewDocumentRequest;
import com.techx.intervue.modules.company.requests.RevokeDocumentRequest;
import com.techx.intervue.modules.company.requests.SearchBusinessVerificationRequest;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationDetailResource;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationListResource;
import com.techx.intervue.modules.company.resources.AdminCompanyAgreementResource;
import com.techx.intervue.modules.company.resources.BusinessDocumentResource;
import com.techx.intervue.modules.company.resources.BusinessVerificationSummaryResource;
import com.techx.intervue.modules.company.resources.CompanyMemberResource;
import com.techx.intervue.modules.company.services.interfaces.BusinessVerificationAdminServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface.StoredDocumentContent;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import java.time.Instant;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BusinessVerificationAdminService implements BusinessVerificationAdminServiceInterface {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.ASC, "submittedAt");
    private static final Sort TIE_BREAKER = Sort.by(Sort.Direction.ASC, "id");
    private static final int SWEEP_BATCH_SIZE = 200;
    private static final Set<DocumentReviewStatus> REVIEWABLE =
            Set.of(DocumentReviewStatus.PENDING_REVIEW, DocumentReviewStatus.MORE_INFO_REQUIRED);

    private final BusinessDocumentRepository businessDocumentRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final CompanyAgreementRepository companyAgreementRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final StorageServiceInterface storageService;
    private final AdminBusinessVerificationMapper adminMapper;
    private final BusinessDocumentMapper businessDocumentMapper;
    private final CompanyProfileCompleteness completeness;
    private final CompanyVerificationServiceInterface companyVerificationService;
    private final RecruiterServiceInterface recruiterService;
    private final NotificationPublisherInterface notificationPublisher;
    private final AuditLogServiceInterface auditLogService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminBusinessVerificationListResource> search(
            SearchBusinessVerificationRequest request, Pageable pageable) {
        Pageable ordered = withStableOrder(pageable);
        Page<BusinessDocument> page =
                businessDocumentRepository.findAll(
                        BusinessDocumentSpecifications.matching(request), ordered);

        Map<Long, RecruiterResource> submitters =
                usersById(
                        page.getContent().stream().map(BusinessDocument::getSubmittedBy).toList());
        List<AdminBusinessVerificationListResource> items =
                page.getContent().stream()
                        .map(
                                document ->
                                        adminMapper.toListResource(
                                                document,
                                                submitters.get(document.getSubmittedBy())))
                        .toList();
        return new PageImpl<>(items, ordered, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public BusinessVerificationSummaryResource summarise() {
        Map<DocumentReviewStatus, Long> counts = new EnumMap<>(DocumentReviewStatus.class);
        for (ReviewStatusCount row : businessDocumentRepository.countGroupedByReviewStatus()) {
            counts.put(row.getStatus(), row.getTotal());
        }
        return BusinessVerificationSummaryResource.builder()
                .total(counts.values().stream().mapToLong(Long::longValue).sum())
                .pendingReview(counts.getOrDefault(DocumentReviewStatus.PENDING_REVIEW, 0L))
                .moreInfoRequired(counts.getOrDefault(DocumentReviewStatus.MORE_INFO_REQUIRED, 0L))
                .approved(counts.getOrDefault(DocumentReviewStatus.APPROVED, 0L))
                .rejected(counts.getOrDefault(DocumentReviewStatus.REJECTED, 0L))
                .revoked(counts.getOrDefault(DocumentReviewStatus.REVOKED, 0L))
                .expired(counts.getOrDefault(DocumentReviewStatus.EXPIRED, 0L))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminBusinessVerificationDetailResource findDetail(Long documentId) {
        return detailOf(requireDocument(documentId));
    }

    @Override
    public StoredDocumentContent readDocument(Long documentId) {
        BusinessDocument document = requireDocument(documentId);
        return new StoredDocumentContent(
                document.getOriginalFileName(),
                document.getContentType(),
                storageService.fetchDocument(
                        document.getStoragePublicId(), StorageTarget.LEGAL_DOCUMENT));
    }

    @Override
    public StoredDocumentContent readIdentityDocument(Long documentId) {
        BusinessDocument document = requireDocument(documentId);
        if (document.getIdentityStoragePublicId() == null) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        return new StoredDocumentContent(
                document.getIdentityFileName() == null
                        ? "identity_card.png"
                        : document.getIdentityFileName(),
                "image/png",
                storageService.fetchDocument(
                        document.getIdentityStoragePublicId(), StorageTarget.IDENTITY_DOCUMENT));
    }

    @Override
    public StoredDocumentContent readIdentityBackDocument(Long documentId) {
        BusinessDocument document = requireDocument(documentId);
        if (document.getIdentityBackStoragePublicId() == null) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        return new StoredDocumentContent(
                document.getIdentityBackFileName() == null
                        ? "identity_card_back.png"
                        : document.getIdentityBackFileName(),
                "image/png",
                storageService.fetchDocument(
                        document.getIdentityBackStoragePublicId(),
                        StorageTarget.IDENTITY_DOCUMENT));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminCompanyAgreementResource> searchAgreements(
            AgreementStatus status, Pageable pageable) {
        Page<CompanyAgreement> page =
                status == null
                        ? companyAgreementRepository.findByScopeAndAcceptanceMode(
                                AgreementScope.COMPANY,
                                AgreementAcceptanceMode.CUSTOM_UPLOAD,
                                pageable)
                        : companyAgreementRepository.findByScopeAndAcceptanceModeAndStatus(
                                AgreementScope.COMPANY,
                                AgreementAcceptanceMode.CUSTOM_UPLOAD,
                                status,
                                pageable);

        Map<Long, RecruiterResource> signers =
                usersById(page.getContent().stream().map(CompanyAgreement::getSignedBy).toList());

        List<AdminCompanyAgreementResource> items =
                page.getContent().stream()
                        .map(
                                agreement -> {
                                    RecruiterResource signer = signers.get(agreement.getSignedBy());
                                    Company company = agreement.getCompany();
                                    return AdminCompanyAgreementResource.builder()
                                            .id(agreement.getId())
                                            .scope(agreement.getScope())
                                            .companyId(company.getId())
                                            .companyName(company.getName())
                                            .companyTaxCode(company.getTaxCode())
                                            .signedByUserId(agreement.getSignedBy())
                                            .signedByName(signer == null ? null : signer.name())
                                            .signedByEmail(signer == null ? null : signer.email())
                                            .agreementType(agreement.getAgreementType())
                                            .acceptanceMode(agreement.getAcceptanceMode())
                                            .version(agreement.getVersion())
                                            .status(agreement.getStatus())
                                            .acceptedAt(agreement.getAcceptedAt())
                                            .storagePublicId(agreement.getStoragePublicId())
                                            .build();
                                })
                        .toList();

        return new PageImpl<>(items, pageable, page.getTotalElements());
    }

    @Override
    public StoredDocumentContent readAgreement(Long agreementId) {
        CompanyAgreement agreement = requireAgreement(agreementId);
        if (agreement.getStoragePublicId() == null) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        return new StoredDocumentContent(
                "custom_agreement_" + agreement.getId() + ".pdf",
                "application/pdf",
                storageService.fetchDocument(
                        agreement.getStoragePublicId(), StorageTarget.LEGAL_DOCUMENT));
    }

    @Override
    @Transactional
    public void approveAgreement(Long agreementId, RequestActor actor) {
        CompanyAgreement agreement = reviewAgreement(agreementId, AgreementStatus.ACCEPTED);
        audit(
                actor,
                AuditAction.AGREEMENT_ACCEPTED,
                AuditTargetType.COMPANY,
                agreement.getCompany().getId(),
                "Approved custom agreement: " + agreement.getAgreementType(),
                null);
        notifyAgreementReviewed(agreement, "được chấp thuận", null);
    }

    @Override
    @Transactional
    public void rejectAgreement(
            Long agreementId, ReviewDocumentRequest request, RequestActor actor) {
        CompanyAgreement agreement = reviewAgreement(agreementId, AgreementStatus.REJECTED);
        audit(
                actor,
                AuditAction.BUSINESS_DOCUMENT_REJECTED,
                AuditTargetType.COMPANY,
                agreement.getCompany().getId(),
                "Rejected custom agreement: " + agreement.getAgreementType(),
                request == null ? null : request.reason());
        notifyAgreementReviewed(agreement, "bị từ chối", request == null ? null : request.reason());
    }

    @Override
    @Transactional
    public AdminBusinessVerificationDetailResource approve(
            Long documentId, ApproveDocumentRequest request, RequestActor actor) {
        BusinessDocument document = requireReviewable(documentId);

        if (document.getDocumentType() == BusinessDocumentType.LETTER_OF_AUTHORIZATION
                && request.expiresAt() == null) {
            throw new AppException(ErrorCode.DOCUMENT_EXPIRY_REQUIRED);
        }
        if (request.expiresAt() != null && request.expiresAt().isBefore(Instant.now())) {
            throw AppException.validation("expiresAt", "The expiry date must be in the future");
        }

        document.setReviewStatus(DocumentReviewStatus.APPROVED);
        document.setReviewReason(null);
        document.setExpiresAt(request.expiresAt());
        stampReview(document, actor);

        audit(
                actor,
                AuditAction.BUSINESS_DOCUMENT_APPROVED,
                AuditTargetType.BUSINESS_DOCUMENT,
                document.getId(),
                document.getDocumentType().name(),
                null);
        notifyRecruiter(document, null);
        return detailOf(document);
    }

    @Override
    @Transactional
    public AdminBusinessVerificationDetailResource reject(
            Long documentId, ReviewDocumentRequest request, RequestActor actor) {
        return decide(
                documentId,
                request,
                actor,
                DocumentReviewStatus.REJECTED,
                AuditAction.BUSINESS_DOCUMENT_REJECTED);
    }

    @Override
    @Transactional
    public AdminBusinessVerificationDetailResource requestMoreInformation(
            Long documentId, ReviewDocumentRequest request, RequestActor actor) {
        return decide(
                documentId,
                request,
                actor,
                DocumentReviewStatus.MORE_INFO_REQUIRED,
                AuditAction.BUSINESS_DOCUMENT_MORE_INFO_REQUESTED);
    }

    @Override
    @Transactional
    public AdminBusinessVerificationDetailResource revoke(
            Long documentId, RevokeDocumentRequest request, RequestActor actor) {
        BusinessDocument document = requireDocument(documentId);
        if (document.getReviewStatus() != DocumentReviewStatus.APPROVED) {
            throw new AppException(ErrorCode.DOCUMENT_NOT_APPROVED);
        }

        document.setReviewStatus(DocumentReviewStatus.REVOKED);
        document.setReviewReason(request.reason());
        stampReview(document, actor);

        audit(
                actor,
                AuditAction.BUSINESS_DOCUMENT_REVOKED,
                AuditTargetType.BUSINESS_DOCUMENT,
                document.getId(),
                document.getDocumentType().name(),
                request.reason());
        notifyRecruiter(document, request.reason());
        publishLoss(document, PublishRightLossCause.DOCUMENT_REVOKED);
        return detailOf(document);
    }

    // Runs after the restriction sweep so the two never contend for the same rows.
    @Override
    @Transactional
    @Scheduled(cron = "0 15 2 * * *")
    public int expireLapsedAuthorizations() {
        List<BusinessDocument> lapsed =
                businessDocumentRepository
                        .findByReviewStatusAndExpiresAtLessThanEqualOrderByExpiresAtAsc(
                                DocumentReviewStatus.APPROVED,
                                Instant.now(),
                                PageRequest.of(0, SWEEP_BATCH_SIZE));
        for (BusinessDocument document : lapsed) {
            document.setReviewStatus(DocumentReviewStatus.EXPIRED);
            auditLogService.record(
                    AuditEntry.builder()
                            .actorType(AuditActorType.SYSTEM)
                            .action(AuditAction.BUSINESS_DOCUMENT_EXPIRED)
                            .targetType(AuditTargetType.BUSINESS_DOCUMENT)
                            .targetId(document.getId())
                            .detail(document.getDocumentType().name())
                            .build());
            notifyRecruiter(document, null);
            publishLoss(document, PublishRightLossCause.DOCUMENT_EXPIRED);
        }
        return lapsed.size();
    }

    private void publishLoss(BusinessDocument document, PublishRightLossCause cause) {
        eventPublisher.publishEvent(
                PublishRightLostEvent.builder()
                        .userId(document.getSubmittedBy())
                        .companyId(document.getCompany().getId())
                        .companyName(document.getCompany().getName())
                        .cause(cause)
                        .occurredAt(Instant.now())
                        .build());
    }

    private AdminBusinessVerificationDetailResource decide(
            Long documentId,
            ReviewDocumentRequest request,
            RequestActor actor,
            DocumentReviewStatus outcome,
            AuditAction action) {
        BusinessDocument document = requireReviewable(documentId);
        document.setReviewStatus(outcome);
        document.setReviewReason(request.reason());
        stampReview(document, actor);

        audit(
                actor,
                action,
                AuditTargetType.BUSINESS_DOCUMENT,
                document.getId(),
                document.getDocumentType().name(),
                request.reason());
        notifyRecruiter(document, request.reason());
        return detailOf(document);
    }

    private void stampReview(BusinessDocument document, RequestActor actor) {
        document.setReviewedAt(Instant.now());
        document.setReviewedBy(actor.userId());
    }

    private CompanyAgreement requireAgreement(Long agreementId) {
        return companyAgreementRepository
                .findById(agreementId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private CompanyAgreement reviewAgreement(Long agreementId, AgreementStatus status) {
        CompanyAgreement agreement = requireAgreement(agreementId);
        agreement.setStatus(status);
        companyAgreementRepository.save(agreement);

        if (agreement.getScope() == AgreementScope.COMPANY && agreement.getSignedBy() != null) {
            companyAgreementRepository
                    .findFirstByUserIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
                            agreement.getSignedBy(),
                            AgreementScope.USER,
                            agreement.getAgreementType())
                    .ifPresent(
                            userAgreement -> {
                                userAgreement.setStatus(status);
                                companyAgreementRepository.save(userAgreement);
                            });
        }
        return agreement;
    }

    private void notifyAgreementReviewed(
            CompanyAgreement agreement, String outcome, String reason) {
        if (agreement.getSignedBy() == null) {
            return;
        }
        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.RECRUITER)
                        .recipientId(agreement.getSignedBy())
                        .type(NotificationType.AGREEMENT_REVIEWED)
                        .params(
                                Map.of(
                                        "companyName",
                                        agreement.getCompany().getName(),
                                        "outcome",
                                        outcome,
                                        "reason",
                                        reason == null || reason.isBlank() ? "—" : reason))
                        .actionUrl("/recruiter/company/agreements")
                        .build());
    }

    private void notifyRecruiter(BusinessDocument document, String reason) {
        RecruiterResource recruiter = recruiterService.getMe(document.getSubmittedBy());
        eventPublisher.publishEvent(
                new BusinessDocumentReviewedEvent(
                        recruiter.id(),
                        recruiter.email(),
                        recruiter.name(),
                        document.getReviewStatus(),
                        document.getDocumentType(),
                        document.getCompany().getName(),
                        reason,
                        document.getExpiresAt()));
    }

    private AdminBusinessVerificationDetailResource detailOf(BusinessDocument document) {
        Company company = document.getCompany();
        List<CompanyMember> members = companyMemberRepository.findByCompanyId(company.getId());
        Map<Long, RecruiterResource> users =
                usersById(members.stream().map(CompanyMember::getUserId).toList());

        List<CompanyMemberResource> memberResources =
                members.stream()
                        .map(
                                member ->
                                        adminMapper.toMemberResource(
                                                member,
                                                users.get(member.getUserId()),
                                                member.isActive()
                                                        && companyVerificationService.canPublish(
                                                                member.getUserId()),
                                                companyAgreementRepository
                                                        .hasAcceptedCandidateDataAgreement(
                                                                member.getUserId())))
                        .toList();

        CompanyProfile submitterProfile =
                members.stream()
                        .filter(member -> member.getUserId().equals(document.getSubmittedBy()))
                        .findFirst()
                        .flatMap(member -> companyProfileRepository.findByMemberId(member.getId()))
                        .orElse(null);
        boolean profileComplete =
                submitterProfile != null && completeness.isComplete(submitterProfile);

        List<BusinessDocumentResource> companyDocuments =
                businessDocumentRepository
                        .findByCompanyIdOrderBySubmittedAtDesc(company.getId())
                        .stream()
                        .map(found -> businessDocumentMapper.toResource(found, null))
                        .toList();

        return AdminBusinessVerificationDetailResource.builder()
                .document(businessDocumentMapper.toResource(document, null))
                .company(
                        adminMapper.toCompanyFacts(
                                company, submitterProfile, profileComplete, members.size()))
                .submitter(
                        memberResources.stream()
                                .filter(member -> member.userId().equals(document.getSubmittedBy()))
                                .findFirst()
                                .orElse(null))
                .members(memberResources)
                .companyDocuments(companyDocuments)
                .build();
    }

    private Map<Long, RecruiterResource> usersById(List<Long> userIds) {
        if (userIds.isEmpty()) {
            return Map.of();
        }
        return recruiterService.findByIds(userIds).stream()
                .collect(Collectors.toMap(RecruiterResource::id, Function.identity()));
    }

    private BusinessDocument requireDocument(Long documentId) {
        return businessDocumentRepository
                .findById(documentId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private BusinessDocument requireReviewable(Long documentId) {
        BusinessDocument document = requireDocument(documentId);
        if (!REVIEWABLE.contains(document.getReviewStatus())) {
            throw new AppException(ErrorCode.DOCUMENT_NOT_UNDER_REVIEW);
        }
        return document;
    }

    private Pageable withStableOrder(Pageable pageable) {
        Sort requested = pageable.getSort().isSorted() ? pageable.getSort() : DEFAULT_SORT;
        return PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), requested.and(TIE_BREAKER));
    }

    private void audit(
            RequestActor actor,
            AuditAction action,
            AuditTargetType targetType,
            Long targetId,
            String detail,
            String reason) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(targetType)
                        .targetId(targetId)
                        .reason(reason)
                        .detail(detail)
                        .ip(actor.ip())
                        .build());
    }
}
