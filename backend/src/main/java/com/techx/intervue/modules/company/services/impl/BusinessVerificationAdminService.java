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
import com.techx.intervue.modules.company.enums.AgreementAcceptanceMode;
import com.techx.intervue.modules.company.enums.AgreementScope;
import com.techx.intervue.modules.company.enums.AgreementStatus;
import com.techx.intervue.modules.company.enums.AgreementType;
import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import com.techx.intervue.modules.company.enums.CompanyVerificationStatus;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import com.techx.intervue.modules.company.enums.PublishRightLossCause;
import com.techx.intervue.modules.company.enums.PublishRightLossScope;
import com.techx.intervue.modules.company.events.BusinessDocumentReviewedEvent;
import com.techx.intervue.modules.company.events.PublishRightLostEvent;
import com.techx.intervue.modules.company.mappers.AdminBusinessVerificationMapper;
import com.techx.intervue.modules.company.mappers.BusinessDocumentMapper;
import com.techx.intervue.modules.company.repositories.BusinessDocumentRepository;
import com.techx.intervue.modules.company.repositories.BusinessDocumentRepository.ReviewStatusCount;
import com.techx.intervue.modules.company.repositories.BusinessDocumentSpecifications;
import com.techx.intervue.modules.company.repositories.CompanyAgreementRepository;
import com.techx.intervue.modules.company.repositories.CompanyMemberRepository;
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
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
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
    private final StorageServiceInterface storageService;
    private final AdminBusinessVerificationMapper adminMapper;
    private final BusinessDocumentMapper businessDocumentMapper;
    private final CompanyProfileCompleteness completeness;
    private final CompanyVerificationServiceInterface companyVerificationService;
    private final UserServiceInterface userService;
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

        Map<Long, UserResource> submitters =
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
    @Transactional(readOnly = true)
    public Page<AdminCompanyAgreementResource> searchAgreements(
            AgreementStatus status, Pageable pageable) {
        Page<CompanyAgreement> page =
                status == null
                        ? companyAgreementRepository.findByAcceptanceMode(
                                AgreementAcceptanceMode.CUSTOM_UPLOAD, pageable)
                        : companyAgreementRepository.findByAcceptanceModeAndStatus(
                                AgreementAcceptanceMode.CUSTOM_UPLOAD, status, pageable);

        Map<Long, UserResource> signers =
                usersById(page.getContent().stream().map(CompanyAgreement::getSignedBy).toList());

        List<AdminCompanyAgreementResource> items =
                page.getContent().stream()
                        .map(
                                agreement -> {
                                    UserResource signer = signers.get(agreement.getSignedBy());
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
        CompanyAgreement agreement =
                companyAgreementRepository
                        .findById(agreementId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
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
        CompanyAgreement agreement =
                companyAgreementRepository
                        .findById(agreementId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        agreement.setStatus(AgreementStatus.ACCEPTED);
        companyAgreementRepository.save(agreement);

        audit(
                actor,
                AuditAction.AGREEMENT_ACCEPTED,
                AuditTargetType.COMPANY,
                agreement.getCompany().getId(),
                "Approved custom agreement: " + agreement.getAgreementType(),
                null);
    }

    @Override
    @Transactional
    public void rejectAgreement(
            Long agreementId, ReviewDocumentRequest request, RequestActor actor) {
        CompanyAgreement agreement =
                companyAgreementRepository
                        .findById(agreementId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        agreement.setStatus(AgreementStatus.REJECTED);
        companyAgreementRepository.save(agreement);

        audit(
                actor,
                AuditAction.BUSINESS_DOCUMENT_REJECTED,
                AuditTargetType.COMPANY,
                agreement.getCompany().getId(),
                "Rejected custom agreement: " + agreement.getAgreementType(),
                request == null ? null : request.reason());
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

        Company company = document.getCompany();
        if (document.getDocumentType() == BusinessDocumentType.BUSINESS_LICENSE
                && !company.isVerified()) {
            company.setVerificationStatus(CompanyVerificationStatus.VERIFIED);
            company.setVerifiedAt(Instant.now());
            audit(
                    actor,
                    AuditAction.COMPANY_VERIFIED,
                    AuditTargetType.COMPANY,
                    company.getId(),
                    company.getName(),
                    null);
        }

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

        Company company = document.getCompany();
        boolean companyWide =
                document.getDocumentType() == BusinessDocumentType.BUSINESS_LICENSE
                        && company.isVerified()
                        && !hasAnotherLicenceInForce(company.getId(), documentId);

        document.setReviewStatus(DocumentReviewStatus.REVOKED);
        document.setReviewReason(request.reason());
        stampReview(document, actor);

        if (companyWide) {
            company.setVerificationStatus(CompanyVerificationStatus.REVOKED);
            company.setVerifiedAt(null);
            audit(
                    actor,
                    AuditAction.COMPANY_VERIFICATION_REVOKED,
                    AuditTargetType.COMPANY,
                    company.getId(),
                    company.getName(),
                    request.reason());
        }

        audit(
                actor,
                AuditAction.BUSINESS_DOCUMENT_REVOKED,
                AuditTargetType.BUSINESS_DOCUMENT,
                document.getId(),
                document.getDocumentType().name(),
                request.reason());
        notifyRecruiter(document, request.reason());
        publishLoss(
                document,
                companyWide ? PublishRightLossScope.COMPANY_WIDE : PublishRightLossScope.INDIVIDUAL,
                companyWide
                        ? PublishRightLossCause.COMPANY_VERIFICATION_REVOKED
                        : PublishRightLossCause.DOCUMENT_REVOKED);
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
            publishLoss(
                    document,
                    PublishRightLossScope.INDIVIDUAL,
                    PublishRightLossCause.DOCUMENT_EXPIRED);
        }
        return lapsed.size();
    }

    private boolean hasAnotherLicenceInForce(Long companyId, Long excludedDocumentId) {
        return businessDocumentRepository.findByCompanyIdOrderBySubmittedAtDesc(companyId).stream()
                .filter(found -> !found.getId().equals(excludedDocumentId))
                .filter(found -> found.getDocumentType() == BusinessDocumentType.BUSINESS_LICENSE)
                .anyMatch(BusinessDocument::isEffective);
    }

    private void publishLoss(
            BusinessDocument document, PublishRightLossScope scope, PublishRightLossCause cause) {
        eventPublisher.publishEvent(
                PublishRightLostEvent.builder()
                        .userId(
                                scope == PublishRightLossScope.COMPANY_WIDE
                                        ? null
                                        : document.getSubmittedBy())
                        .companyId(document.getCompany().getId())
                        .scope(scope)
                        .cause(cause)
                        .reassignToUserId(
                                scope == PublishRightLossScope.COMPANY_WIDE
                                        ? null
                                        : ownerIdOf(document.getCompany().getId()))
                        .occurredAt(Instant.now())
                        .build());
    }

    private Long ownerIdOf(Long companyId) {
        return companyMemberRepository
                .findByCompanyIdAndStatus(companyId, CompanyMemberStatus.ACTIVE)
                .stream()
                .filter(CompanyMember::isOwner)
                .map(CompanyMember::getUserId)
                .findFirst()
                .orElse(null);
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

    private void notifyRecruiter(BusinessDocument document, String reason) {
        UserResource recruiter = userService.getMe(document.getSubmittedBy());
        eventPublisher.publishEvent(
                new BusinessDocumentReviewedEvent(
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
        Map<Long, UserResource> users =
                usersById(members.stream().map(CompanyMember::getUserId).toList());

        List<CompanyMemberResource> memberResources =
                members.stream()
                        .map(
                                member -> {
                                    UserResource user = users.get(member.getUserId());
                                    boolean phoneVerified = user != null && user.phoneVerified();
                                    boolean userAgreementAccepted =
                                            companyAgreementRepository
                                                    .findFirstByUserIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
                                                            member.getUserId(),
                                                            AgreementScope.USER,
                                                            AgreementType.CANDIDATE_DATA)
                                                    .map(CompanyAgreement::isAccepted)
                                                    .orElse(false);
                                    boolean canPublish =
                                            member.isActive()
                                                    && companyVerificationService.canPublish(
                                                            member.getUserId());
                                    return adminMapper.toMemberResource(
                                            member,
                                            user,
                                            canPublish,
                                            phoneVerified,
                                            userAgreementAccepted);
                                })
                        .toList();

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
                                company, completeness.isComplete(company), members.size()))
                .submitter(
                        memberResources.stream()
                                .filter(member -> member.userId().equals(document.getSubmittedBy()))
                                .findFirst()
                                .orElse(null))
                .members(memberResources)
                .companyDocuments(companyDocuments)
                .build();
    }

    private Map<Long, UserResource> usersById(List<Long> userIds) {
        if (userIds.isEmpty()) {
            return Map.of();
        }
        return userService.findByIds(userIds).stream()
                .collect(Collectors.toMap(UserResource::id, Function.identity()));
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
