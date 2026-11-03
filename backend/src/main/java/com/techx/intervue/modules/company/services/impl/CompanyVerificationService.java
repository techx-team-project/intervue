package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.common.storage.StoredFile;
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
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface.RecruiterActor;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
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
    private final UserServiceInterface userService;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional(readOnly = true)
    public RecruiterVerificationProfileResource findProfile(Long userId) {
        Optional<CompanyMember> membership = activeMembership(userId);
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
    @Transactional(readOnly = true)
    public void assertCanPublish(Long userId) {
        Company company = activeMembership(userId).map(CompanyMember::getCompany).orElse(null);
        ErrorCode blocked = levelPolicy.blockedReason(factsFor(userId, company));
        if (blocked != null) {
            throw new AppException(blocked);
        }
    }

    // Deliberately not transactional: uploading to Cloudinary is an external call and must not
    // hold a database transaction open.
    @Override
    public BusinessDocumentResource submitDocument(
            MultipartFile file, SubmitBusinessDocumentRequest request, RecruiterActor actor) {
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
                                .submittedAt(Instant.now())
                                .build());

        audit(
                actor,
                AuditAction.BUSINESS_DOCUMENT_SUBMITTED,
                document.getId(),
                request.documentType().name());
        return businessDocumentMapper.toResource(document, actor.userId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BusinessDocumentResource> findDocuments(Long userId) {
        CompanyMember membership = requireMembership(userId);
        return businessDocumentRepository
                .findByCompanyIdOrderBySubmittedAtDesc(membership.getCompany().getId())
                .stream()
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

        byte[] bytes = storageService.fetchDocument(document.getStoragePublicId());
        return new StoredDocumentContent(
                document.getOriginalFileName(), document.getContentType(), bytes);
    }

    @Override
    @Transactional
    public void acceptAgreement(AcceptAgreementRequest request, RecruiterActor actor) {
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
            MultipartFile file, AcceptAgreementRequest request, RecruiterActor actor) {
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
            RecruiterActor actor) {
        Long companyId = companyIdOf(membership);
        if (isAcceptedForUser(actor.userId(), agreementType)) {
            throw new AppException(ErrorCode.AGREEMENT_ALREADY_ACCEPTED);
        }

        if (membership.isOwner() && !isAcceptedForCompany(companyId, agreementType)) {
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
            RecruiterActor actor) {
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

    private Facts factsFor(Long userId, Company company) {
        UserResource user = userService.getMe(userId);
        return Facts.builder()
                .emailVerified(user.emailVerified())
                .phoneVerified(user.phoneVerified())
                .companyLinked(company != null)
                .companyAgreementSigned(
                        company != null && allAgreementsAcceptedForCompany(company.getId()))
                .personalAgreementsAccepted(allAgreementsAcceptedForUser(userId))
                .companyVerified(company != null && company.isVerified())
                .ownDocumentEffective(effectiveDocument(userId).isPresent())
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

    private VerificationStepResource licenseStep(Long userId) {
        Optional<BusinessDocument> latest = latestDocument(userId);
        if (latest.isEmpty()) {
            return step(VerificationStepId.LICENSE, VerificationStepStatus.NOT_STARTED);
        }
        BusinessDocument document = latest.get();
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
                    case ACCEPTED ->
                            company != null && isAcceptedForCompany(company.getId(), type)
                                    ? VerificationStepStatus.APPROVED
                                    : VerificationStepStatus.ACTION_REQUIRED;
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
        return companyAgreementRepository
                .findFirstByCompanyIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
                        companyId, AgreementScope.COMPANY, agreementType)
                .filter(agreement -> CURRENT_AGREEMENT_VERSION.equals(agreement.getVersion()))
                .filter(CompanyAgreement::isAccepted)
                .isPresent();
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

    private void audit(RecruiterActor actor, AuditAction action, Long targetId, String detail) {
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
