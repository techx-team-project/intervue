package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.company.entities.BusinessDocument;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyAgreement;
import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.entities.CompanyProfile;
import com.techx.intervue.modules.company.enums.AgreementAcceptanceMode;
import com.techx.intervue.modules.company.enums.AgreementScope;
import com.techx.intervue.modules.company.enums.AgreementStatus;
import com.techx.intervue.modules.company.enums.AgreementType;
import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.BusinessType;
import com.techx.intervue.modules.company.enums.CompanyMemberStatus;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import com.techx.intervue.modules.company.repositories.BusinessDocumentRepository;
import com.techx.intervue.modules.company.repositories.CompanyAgreementRepository;
import com.techx.intervue.modules.company.repositories.CompanyMemberRepository;
import com.techx.intervue.modules.company.repositories.CompanyProfileRepository;
import com.techx.intervue.modules.company.repositories.CompanyRepository;
import com.techx.intervue.modules.company.services.interfaces.LocalDemoCompanyServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.LocalRecruiterSeedServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Profile("local")
@RequiredArgsConstructor
public class LocalDemoCompanyService implements LocalDemoCompanyServiceInterface {

    private static final String DEMO_TAX_CODE = "0318928391";
    private static final String DEMO_COMPANY_NAME = "TechX Global Joint Stock Company";
    private static final String DEMO_ADDRESS = "Keangnam Landmark 72, Nam Tu Liem, Ha Noi";
    private static final String DEMO_PROOF_FILE = "demo-business-license.pdf";
    private static final String DEMO_PROOF_ID = "demo/business-license";
    private static final String BLANK_CHECKSUM = "0".repeat(64);

    private final CompanyRepository companyRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final BusinessDocumentRepository businessDocumentRepository;
    private final CompanyAgreementRepository companyAgreementRepository;
    private final CompanyLinker companyLinker;
    private final LocalRecruiterSeedServiceInterface recruiterSeedService;

    @Override
    @Transactional
    public void prepare(RequestActor actor) {
        CompanyMember membership =
                companyMemberRepository
                        .findActiveWithCompany(actor.userId(), CompanyMemberStatus.ACTIVE)
                        .orElseGet(() -> companyLinker.link(demoCompany(), actor));
        fillProfile(membership);
        recruiterSeedService.markContactVerified(actor.userId());
        acceptAgreements(membership.getCompany(), actor.userId());
        approveBusinessLicense(membership.getCompany(), actor.userId());
    }

    private Company demoCompany() {
        return companyRepository
                .findByTaxCode(DEMO_TAX_CODE)
                .orElseGet(
                        () ->
                                companyRepository.save(
                                        Company.builder()
                                                .name(DEMO_COMPANY_NAME)
                                                .taxCode(DEMO_TAX_CODE)
                                                .address(DEMO_ADDRESS)
                                                .build()));
    }

    private void fillProfile(CompanyMember membership) {
        CompanyProfile profile =
                companyProfileRepository.findByMemberId(membership.getId()).orElseThrow();
        profile.setTradingName("TechX Global");
        profile.setBusinessType(BusinessType.ENTERPRISE);
        profile.setIndustry("Software & Information Technology");
        profile.setSize("100-499 employees");
        profile.setAddress(DEMO_ADDRESS);
        profile.setEmail("careers@techx.example.com");
        profile.setPhone("02812345678");
        profile.setWebsite("https://techx.example.com");
        profile.setDescription(
                "TechX Global builds AI-powered recruitment and SaaS products for companies across"
                        + " Southeast Asia. Our engineers ship to production every week.");
        profile.setBenefits(
                "13th-month salary and performance bonus\nPremium health insurance\nMacBook Pro and"
                        + " learning budget\nFlexible hybrid working");
        companyProfileRepository.save(profile);
    }

    private void acceptAgreements(Company company, Long recruiterId) {
        for (AgreementType type : AgreementType.values()) {
            boolean accepted =
                    companyAgreementRepository
                            .findFirstByUserIdAndScopeAndAgreementTypeOrderByAcceptedAtDesc(
                                    recruiterId, AgreementScope.USER, type)
                            .filter(
                                    agreement ->
                                            CompanyVerificationService.CURRENT_AGREEMENT_VERSION
                                                    .equals(agreement.getVersion()))
                            .filter(CompanyAgreement::isAccepted)
                            .isPresent();
            if (!accepted) {
                companyAgreementRepository.save(
                        CompanyAgreement.builder()
                                .scope(AgreementScope.USER)
                                .company(company)
                                .userId(recruiterId)
                                .signedBy(recruiterId)
                                .agreementType(type)
                                .acceptanceMode(AgreementAcceptanceMode.STANDARD_TEMPLATE)
                                .version(CompanyVerificationService.CURRENT_AGREEMENT_VERSION)
                                .status(AgreementStatus.ACCEPTED)
                                .acceptedAt(Instant.now())
                                .build());
            }
        }
    }

    private void approveBusinessLicense(Company company, Long recruiterId) {
        boolean effective =
                businessDocumentRepository
                        .findBySubmittedByAndReviewStatus(
                                recruiterId, DocumentReviewStatus.APPROVED)
                        .stream()
                        .anyMatch(BusinessDocument::isEffective);
        if (effective) {
            return;
        }
        Instant now = Instant.now();
        businessDocumentRepository.save(
                BusinessDocument.builder()
                        .company(company)
                        .submittedBy(recruiterId)
                        .documentType(BusinessDocumentType.BUSINESS_LICENSE)
                        .reviewStatus(DocumentReviewStatus.APPROVED)
                        .storagePublicId(DEMO_PROOF_ID)
                        .originalFileName(DEMO_PROOF_FILE)
                        .fileSizeBytes(1024)
                        .contentType("application/pdf")
                        .checksumSha256(BLANK_CHECKSUM)
                        .submittedAt(now)
                        .reviewedAt(now)
                        .reviewReason("Approved automatically for the local demo")
                        .build());
    }
}
