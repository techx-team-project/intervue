package com.techx.intervue.modules.company.services.impl;

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
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import com.techx.intervue.modules.company.enums.VerificationStepId;
import com.techx.intervue.modules.company.enums.VerificationStepStatus;
import com.techx.intervue.modules.company.mappers.BusinessDocumentMapper;
import com.techx.intervue.modules.company.repositories.BusinessDocumentRepository;
import com.techx.intervue.modules.company.repositories.CompanyAgreementRepository;
import com.techx.intervue.modules.company.repositories.CompanyMemberRepository;
import com.techx.intervue.modules.company.requests.AcceptAgreementRequest;
import com.techx.intervue.modules.company.requests.SubmitBusinessDocumentRequest;
import com.techx.intervue.modules.company.resources.BusinessDocumentResource;
import com.techx.intervue.modules.company.resources.RecruiterVerificationProfileResource;
import com.techx.intervue.modules.company.resources.VerificationStepResource;
import com.techx.intervue.modules.company.services.impl.CompanyVerificationLevelPolicy.Facts;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompanyVerificationService implements CompanyVerificationServiceInterface {

    private static final String CURRENT_AGREEMENT_VERSION = "v2.1";
    private static final String DOCUMENT_FOLDER = "companies/documents";
    private static final String AGREEMENT_FOLDER = "companies/agreements";
    private static final String TEMPLATE_PATH = "agreements/%s-%s.txt";
    private static final int TOTAL_STEPS = 5;
    private static final int PERCENT = 100;

    private final CompanyMemberRepository companyMemberRepository;
    private final BusinessDocumentRepository businessDocumentRepository;
    private final CompanyAgreementRepository companyAgreementRepository;
    private final StorageServiceInterface storageService;
    private final BusinessDocumentMapper businessDocumentMapper;
    private final CompanyProfileCompleteness completeness;
    private final CompanyVerificationLevelPolicy levelPolicy;
    private final RecruiterServiceInterface recruiterService;
    private final AuditLogServiceInterface auditLogService;
    private final UserServiceInterface userService;
    private final NotificationPublisherInterface notificationPublisher;

    @Override
    @Transactional
    public RecruiterVerificationProfileResource findProfile(Long userId) {
        Optional<CompanyMember> membership = activeMembership(userId);
        membership.ifPresent(this::ensureOwnerAgreementsInherited);
        Company company = membership.map(CompanyMember::getCompany).orElse(null);
        Facts facts = factsFor(userId, company);
        List<VerificationStepResource> steps = buildSteps(userId, company, facts);

        int completed = (int) steps.stream().filter(this::isDone).count();
        ErrorCode blocked = levelPolicy.blockedReason(facts);

        return RecruiterVerificationProfileResource.builder()
                .level(levelPolicy.levelOf(facts))
                .stepsCompleted(completed)
                .stepsTotal(TOTAL_STEPS)
                .completionPercent(completed * PERCENT / TOTAL_STEPS)
                .canPublish(levelPolicy.canPublish(facts))
                .blockedReason(blocked == null ? null : blocked.name())
                .companyId(company == null ? null : company.getId())
                .steps(steps)
                .build();
    }

    @Override
    @Transactional
    public boolean canPublish(Long userId) {
        Optional<CompanyMember> membership = activeMembership(userId);
        membership.ifPresent(this::ensureOwnerAgreementsInherited);
        Company company = membership.map(CompanyMember::getCompany).orElse(null);
        return levelPolicy.canPublish(factsFor(userId, company));
    }

    @Override
    @Transactional
    public void assertCanPublish(Long userId) {
        Optional<CompanyMember> membership = activeMembership(userId);
        membership.ifPresent(this::ensureOwnerAgreementsInherited);
        Company company = membership.map(CompanyMember::getCompany).orElse(null);
        ErrorCode blocked = levelPolicy.blockedReason(factsFor(userId, company));
        if (blocked != null) {
            throw new AppException(blocked);
        }
    }

    // Deliberately not transactional: uploading to Cloudinary is an external call and must not
    // hold a database transaction open.
    @Override
    public BusinessDocumentResource submitDocument(
            MultipartFile file, SubmitBusinessDocumentRequest request, RequestActor actor) {
        return submitDocument(file, null, request, actor);
    }

    @Override
    public BusinessDocumentResource submitDocument(
            MultipartFile file,
            MultipartFile identityFile,
            SubmitBusinessDocumentRequest request,
            RequestActor actor) {
        return submitDocument(file, identityFile, null, request, actor);
    }

    @Override
    public BusinessDocumentResource submitDocument(
            MultipartFile file,
            MultipartFile identityFile,
            MultipartFile identityBackFile,
            SubmitBusinessDocumentRequest request,
            RequestActor actor) {
        CompanyMember membership = requireMembership(actor.userId());
        Company company = membership.getCompany();

        if (request.documentType() == BusinessDocumentType.BUSINESS_LICENSE) {
            if (!membership.isOwner()) {
                throw new AppException(ErrorCode.ONLY_OWNER_CAN_SUBMIT_LICENSE);
            }
            if (!completeness.isComplete(company)) {
                throw new AppException(ErrorCode.COMPANY_PROFILE_INCOMPLETE);
            }
        }
        if (businessDocumentRepository.existsBySubmittedByAndDocumentTypeAndReviewStatus(
                actor.userId(), request.documentType(), DocumentReviewStatus.PENDING_REVIEW)) {
            throw new AppException(ErrorCode.DOCUMENT_ALREADY_UNDER_REVIEW);
        }

        StoredFile stored =
                storageService.upload(file, StorageTarget.LEGAL_DOCUMENT, DOCUMENT_FOLDER);
        StoredFile identityStored = null;
        if (identityFile != null && !identityFile.isEmpty()) {
            identityStored =
                    storageService.upload(
                            identityFile, StorageTarget.IDENTITY_DOCUMENT, "identity");
        }
        StoredFile identityBackStored = null;
        if (identityBackFile != null && !identityBackFile.isEmpty()) {
            identityBackStored =
                    storageService.upload(
                            identityBackFile, StorageTarget.IDENTITY_DOCUMENT, "identity");
        }

        BusinessDocument document =
                businessDocumentRepository.save(
                        BusinessDocument.builder()
                                .company(company)
                                .submittedBy(actor.userId())
                                .documentType(request.documentType())
                                .reviewStatus(DocumentReviewStatus.PENDING_REVIEW)
                                .storagePublicId(stored.publicId())
                                .originalFileName(stored.originalFileName())
                                .fileSizeBytes(stored.sizeInBytes())
                                .contentType(stored.contentType())
                                .checksumSha256(stored.checksumSha256())
                                .identityStoragePublicId(
                                        identityStored == null ? null : identityStored.publicId())
                                .identityFileName(
                                        identityStored == null
                                                ? null
                                                : identityStored.originalFileName())
                                .identityBackStoragePublicId(
                                        identityBackStored == null
                                                ? null
                                                : identityBackStored.publicId())
                                .identityBackFileName(
                                        identityBackStored == null
                                                ? null
                                                : identityBackStored.originalFileName())
                                .submittedAt(Instant.now())
                                .build());

        audit(
                actor,
                AuditAction.BUSINESS_DOCUMENT_SUBMITTED,
                document.getId(),
                request.documentType().name());
        notifyAdminQueue(company.getName(), "Thẩm định hồ sơ doanh nghiệp");
        return businessDocumentMapper.toResource(document, actor.userId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BusinessDocumentResource> findDocuments(Long userId) {
        CompanyMember membership = requireMembership(userId);
        List<BusinessDocument> documents =
                businessDocumentRepository.findByCompanyIdOrderBySubmittedAtDesc(
                        membership.getCompany().getId());
        if (!membership.isOwner()) {
            documents =
                    documents.stream()
                            .filter(
                                    doc ->
                                            doc.getSubmittedBy().equals(userId)
                                                    || doc.getDocumentType()
                                                            == BusinessDocumentType
                                                                    .BUSINESS_LICENSE)
                            .toList();
        }
        return documents.stream()
                .map(document -> businessDocumentMapper.toResource(document, userId))
                .toList();
    }

    @Override
    public StoredDocumentContent readDocument(Long documentId, Long userId) {
        CompanyMember membership = requireMembership(userId);
        BusinessDocument document =
                businessDocumentRepository
                        .findById(documentId)
                        .filter(found -> found.getCompany().getId().equals(companyIdOf(membership)))
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        if (!membership.isOwner() && !document.getSubmittedBy().equals(userId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }

        byte[] bytes =
                storageService.fetchDocument(
                        document.getStoragePublicId(), StorageTarget.LEGAL_DOCUMENT);
        return new StoredDocumentContent(
                document.getOriginalFileName(), document.getContentType(), bytes);
    }

    @Override
    public StoredDocumentContent readIdentityDocument(Long documentId, Long userId) {
        CompanyMember membership = requireMembership(userId);
        BusinessDocument document =
                businessDocumentRepository
                        .findById(documentId)
                        .filter(found -> found.getCompany().getId().equals(companyIdOf(membership)))
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        if (!membership.isOwner() && !document.getSubmittedBy().equals(userId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        if (document.getIdentityStoragePublicId() == null) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }

        byte[] bytes =
                storageService.fetchDocument(
                        document.getIdentityStoragePublicId(), StorageTarget.IDENTITY_DOCUMENT);
        return new StoredDocumentContent(
                document.getIdentityFileName() == null
                        ? "identity_card_front.png"
                        : document.getIdentityFileName(),
                "image/png",
                bytes);
    }

    @Override
    public StoredDocumentContent readIdentityBackDocument(Long documentId, Long userId) {
        CompanyMember membership = requireMembership(userId);
        BusinessDocument document =
                businessDocumentRepository
                        .findById(documentId)
                        .filter(found -> found.getCompany().getId().equals(companyIdOf(membership)))
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        if (!membership.isOwner() && !document.getSubmittedBy().equals(userId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        if (document.getIdentityBackStoragePublicId() == null) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }

        byte[] bytes =
                storageService.fetchDocument(
                        document.getIdentityBackStoragePublicId(), StorageTarget.IDENTITY_DOCUMENT);
        return new StoredDocumentContent(
                document.getIdentityBackFileName() == null
                        ? "identity_card_back.png"
                        : document.getIdentityBackFileName(),
                "image/png",
                bytes);
    }

    @Override
    @Transactional
    public void acceptAgreement(AcceptAgreementRequest request, RequestActor actor) {
        CompanyMember membership = requireMembership(actor.userId());
        recordAgreements(
                membership,
                request.agreementType(),
                AgreementAcceptanceMode.STANDARD_TEMPLATE,
                AgreementStatus.ACCEPTED,
                null,
                actor);
    }

    // Deliberately not transactional: uploading to Cloudinary is an external call and must not
    // hold a database transaction open.
    @Override
    public void acceptCustomAgreement(
            MultipartFile file, AcceptAgreementRequest request, RequestActor actor) {
        CompanyMember membership = requireMembership(actor.userId());
        StoredFile stored =
                storageService.upload(file, StorageTarget.LEGAL_DOCUMENT, AGREEMENT_FOLDER);
        recordAgreements(
                membership,
                request.agreementType(),
                AgreementAcceptanceMode.CUSTOM_UPLOAD,
                AgreementStatus.PENDING_REVIEW,
                stored.publicId(),
                actor);
        notifyAdminQueue(membership.getCompany().getName(), "Thẩm định thoả thuận dữ liệu cá nhân");
    }

    private void notifyAdminQueue(String companyName, String queueLabel) {
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
                                                                "companyName", companyName,
                                                                "queueLabel", queueLabel))
                                                .actionUrl("/admin/verification/business")
                                                .build())
                        .toList();
        notificationPublisher.publishAll(commands);
    }

    @Override
    public AgreementTemplate findTemplate(AgreementType agreementType) {
        String fileName =
                String.format(
                        TEMPLATE_PATH,
                        agreementType.name().toLowerCase().replace('_', '-'),
                        CURRENT_AGREEMENT_VERSION);
        try {
            String content =
                    StreamUtils.copyToString(
                            new ClassPathResource(fileName).getInputStream(),
                            StandardCharsets.UTF_8);
            return new AgreementTemplate(
                    fileName.substring(fileName.lastIndexOf('/') + 1), content);
        } catch (IOException e) {
            log.error("Agreement template {} is missing: {}", fileName, e.getMessage());
            throw new AppException(ErrorCode.NOT_FOUND);
        }
    }

    // The owner signs for the legal entity and acknowledges personally in one action, so a member
    // who joins later inherits the company commitment but still has to acknowledge for themselves.
    private void recordAgreements(
            CompanyMember membership,
            AgreementType agreementType,
            AgreementAcceptanceMode mode,
            AgreementStatus status,
            String storagePublicId,
            RequestActor actor) {
        Long companyId = companyIdOf(membership);
        if (isAcceptedForUser(actor.userId(), agreementType)) {
            throw new AppException(ErrorCode.AGREEMENT_ALREADY_ACCEPTED);
        }

        if (!isAcceptedForCompany(companyId, agreementType)) {
            companyAgreementRepository.save(
                    agreementOf(
                            membership,
                            AgreementScope.COMPANY,
                            null,
                            agreementType,
                            mode,
                            status,
                            storagePublicId,
                            actor));
        }
        companyAgreementRepository.save(
                agreementOf(
                        membership,
                        AgreementScope.USER,
                        actor.userId(),
                        agreementType,
                        mode,
                        status,
                        storagePublicId,
                        actor));

        audit(actor, AuditAction.AGREEMENT_ACCEPTED, companyId, agreementType.name());
    }

    private CompanyAgreement agreementOf(
            CompanyMember membership,
            AgreementScope scope,
            Long userId,
            AgreementType agreementType,
            AgreementAcceptanceMode mode,
            AgreementStatus status,
            String storagePublicId,
            RequestActor actor) {
        return CompanyAgreement.builder()
                .scope(scope)
                .company(membership.getCompany())
                .userId(userId)
                .signedBy(actor.userId())
                .agreementType(agreementType)
                .acceptanceMode(mode)
                .version(CURRENT_AGREEMENT_VERSION)
                .status(status)
                .acceptedAt(Instant.now())
                .storagePublicId(storagePublicId)
                .build();
    }

    private Facts factsFor(Long recruiterId, Company company) {
        RecruiterResource recruiter = recruiterService.getMe(recruiterId);
        return Facts.builder()
                .emailVerified(recruiter.emailVerified())
                .phoneVerified(recruiter.phoneVerified())
                .companyLinked(company != null)
                .companyAgreementSigned(
                        company != null && allAgreementsAcceptedForCompany(company.getId()))
                .personalAgreementsAccepted(allAgreementsAcceptedForUser(recruiterId))
                .companyVerified(company != null && company.isVerified())
                .ownDocumentEffective(effectiveDocument(recruiterId).isPresent())
                .build();
    }

    private List<VerificationStepResource> buildSteps(Long userId, Company company, Facts facts) {
        List<VerificationStepResource> steps = new ArrayList<>();
        steps.add(
                step(
                        VerificationStepId.PHONE,
                        facts.phoneVerified()
                                ? VerificationStepStatus.APPROVED
                                : VerificationStepStatus.NOT_STARTED));

        VerificationStepStatus companyStatus;
        if (company == null) {
            companyStatus = VerificationStepStatus.NOT_STARTED;
        } else {
            companyStatus =
                    completeness.isComplete(company)
                            ? VerificationStepStatus.APPROVED
                            : VerificationStepStatus.ACTION_REQUIRED;
        }
        steps.add(step(VerificationStepId.COMPANY, companyStatus));

        steps.add(licenseStep(userId));
        steps.add(agreementStep(VerificationStepId.CANDIDATE_AGREEMENT, userId, company));
        steps.add(agreementStep(VerificationStepId.PLATFORM_AGREEMENT, userId, company));
        return steps;
    }

    // An approved document that is still in force decides this step: submitting a replacement and
    // having it rejected must not make the step contradict the level the recruiter still holds.
    private VerificationStepResource licenseStep(Long userId) {
        Optional<BusinessDocument> source =
                effectiveDocument(userId).or(() -> latestDocument(userId));
        if (source.isEmpty()) {
            return step(VerificationStepId.LICENSE, VerificationStepStatus.NOT_STARTED);
        }
        BusinessDocument document = source.get();
        return VerificationStepResource.builder()
                .stepId(VerificationStepId.LICENSE)
                .status(businessDocumentMapper.toStepStatus(document))
                .completedAt(document.getReviewedAt())
                .reviewReason(document.getReviewReason())
                .expiresAt(document.getExpiresAt())
                .build();
    }

    private VerificationStepResource agreementStep(
            VerificationStepId stepId, Long userId, Company company) {
        AgreementType type =
                stepId == VerificationStepId.CANDIDATE_AGREEMENT
                        ? AgreementType.CANDIDATE_DATA
                        : AgreementType.PLATFORM_DATA;
        Optional<CompanyAgreement> personal = currentUserAgreement(userId, type);
        if (personal.isEmpty()) {
            return step(stepId, VerificationStepStatus.NOT_STARTED);
        }
        CompanyAgreement agreement = personal.get();
        VerificationStepStatus status =
                switch (agreement.getStatus()) {
                    case ACCEPTED -> VerificationStepStatus.APPROVED;
                    case PENDING_REVIEW -> VerificationStepStatus.IN_REVIEW;
                    case REJECTED -> VerificationStepStatus.REJECTED;
                };
        return VerificationStepResource.builder()
                .stepId(stepId)
                .status(status)
                .completedAt(agreement.getAcceptedAt())
                .build();
    }

    private VerificationStepResource step(
            VerificationStepId stepId, VerificationStepStatus status) {
        return VerificationStepResource.builder().stepId(stepId).status(status).build();
    }

    private boolean isDone(VerificationStepResource step) {
        return step.status() == VerificationStepStatus.APPROVED;
    }

    private boolean allAgreementsAcceptedForUser(Long userId) {
        return isAcceptedForUser(userId, AgreementType.CANDIDATE_DATA)
                && isAcceptedForUser(userId, AgreementType.PLATFORM_DATA);
    }

    private boolean allAgreementsAcceptedForCompany(Long companyId) {
        return isAcceptedForCompany(companyId, AgreementType.CANDIDATE_DATA)
                && isAcceptedForCompany(companyId, AgreementType.PLATFORM_DATA);
    }

    private boolean isAcceptedForUser(Long userId, AgreementType agreementType) {
        return currentUserAgreement(userId, agreementType)
                .filter(CompanyAgreement::isAccepted)
                .isPresent();
    }

    private boolean isAcceptedForCompany(Long companyId, AgreementType agreementType) {
        boolean hasCompanyScope =
                companyAgreementRepository
                        .findFirstByCompanyIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
                                companyId, AgreementScope.COMPANY, agreementType)
                        .filter(
                                agreement ->
                                        CURRENT_AGREEMENT_VERSION.equals(agreement.getVersion()))
                        .filter(CompanyAgreement::isAccepted)
                        .isPresent();
        if (hasCompanyScope) {
            return true;
        }
        return companyAgreementRepository
                .findFirstByCompanyIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
                        companyId, AgreementScope.USER, agreementType)
                .filter(agreement -> CURRENT_AGREEMENT_VERSION.equals(agreement.getVersion()))
                .filter(CompanyAgreement::isAccepted)
                .isPresent();
    }

    private void ensureOwnerAgreementsInherited(CompanyMember membership) {
        if (!membership.isOwner() || membership.getCompany() == null) {
            return;
        }
        Long companyId = membership.getCompany().getId();
        Long ownerId = membership.getUserId();
        for (AgreementType type : AgreementType.values()) {
            if (!isAcceptedForCompany(companyId, type)) {
                companyAgreementRepository
                        .findFirstByUserIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
                                ownerId, AgreementScope.USER, type)
                        .filter(ag -> CURRENT_AGREEMENT_VERSION.equals(ag.getVersion()))
                        .filter(CompanyAgreement::isAccepted)
                        .ifPresent(
                                accepted -> {
                                    companyAgreementRepository.save(
                                            CompanyAgreement.builder()
                                                    .scope(AgreementScope.COMPANY)
                                                    .company(membership.getCompany())
                                                    .userId(null)
                                                    .signedBy(ownerId)
                                                    .agreementType(type)
                                                    .acceptanceMode(accepted.getAcceptanceMode())
                                                    .version(CURRENT_AGREEMENT_VERSION)
                                                    .status(AgreementStatus.ACCEPTED)
                                                    .acceptedAt(accepted.getAcceptedAt())
                                                    .storagePublicId(accepted.getStoragePublicId())
                                                    .build());
                                    companyAgreementRepository.save(
                                            CompanyAgreement.builder()
                                                    .scope(AgreementScope.USER)
                                                    .company(membership.getCompany())
                                                    .userId(ownerId)
                                                    .signedBy(ownerId)
                                                    .agreementType(type)
                                                    .acceptanceMode(accepted.getAcceptanceMode())
                                                    .version(CURRENT_AGREEMENT_VERSION)
                                                    .status(AgreementStatus.ACCEPTED)
                                                    .acceptedAt(accepted.getAcceptedAt())
                                                    .storagePublicId(accepted.getStoragePublicId())
                                                    .build());
                                });
            }
        }
    }

    private Optional<CompanyAgreement> currentUserAgreement(
            Long userId, AgreementType agreementType) {
        return companyAgreementRepository
                .findFirstByUserIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
                        userId, AgreementScope.USER, agreementType)
                .filter(agreement -> CURRENT_AGREEMENT_VERSION.equals(agreement.getVersion()));
    }

    private Optional<BusinessDocument> effectiveDocument(Long userId) {
        return businessDocumentRepository
                .findBySubmittedByAndReviewStatus(userId, DocumentReviewStatus.APPROVED)
                .stream()
                .filter(BusinessDocument::isEffective)
                .findFirst();
    }

    private Optional<BusinessDocument> latestDocument(Long userId) {
        return businessDocumentRepository
                .findFirstBySubmittedByAndDocumentTypeOrderBySubmittedAtDesc(
                        userId, BusinessDocumentType.BUSINESS_LICENSE)
                .or(
                        () ->
                                businessDocumentRepository
                                        .findFirstBySubmittedByAndDocumentTypeOrderBySubmittedAtDesc(
                                                userId,
                                                BusinessDocumentType.LETTER_OF_AUTHORIZATION));
    }

    private Optional<CompanyMember> activeMembership(Long userId) {
        return companyMemberRepository.findActiveWithCompany(userId, CompanyMemberStatus.ACTIVE);
    }

    private CompanyMember requireMembership(Long userId) {
        return activeMembership(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_COMPANY_MEMBER));
    }

    private Long companyIdOf(CompanyMember membership) {
        return membership.getCompany().getId();
    }

    private void audit(RequestActor actor, AuditAction action, Long targetId, String detail) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.USER)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(
                                action == AuditAction.AGREEMENT_ACCEPTED
                                        ? AuditTargetType.COMPANY
                                        : AuditTargetType.BUSINESS_DOCUMENT)
                        .targetId(targetId)
                        .detail(detail)
                        .ip(actor.ip())
                        .build());
    }
}
