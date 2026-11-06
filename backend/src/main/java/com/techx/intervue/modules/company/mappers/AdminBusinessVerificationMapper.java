package com.techx.intervue.modules.company.mappers;

import com.techx.intervue.modules.company.entities.BusinessDocument;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.entities.CompanyProfile;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationListResource;
import com.techx.intervue.modules.company.resources.AdminCompanyFactsResource;
import com.techx.intervue.modules.company.resources.CompanyMemberResource;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import org.springframework.stereotype.Component;

@Component
public class AdminBusinessVerificationMapper {

    public AdminBusinessVerificationListResource toListResource(
            BusinessDocument document, RecruiterResource submitter) {
        Company company = document.getCompany();
        return AdminBusinessVerificationListResource.builder()
                .id(document.getId())
                .documentType(document.getDocumentType())
                .reviewStatus(document.getReviewStatus())
                .originalFileName(document.getOriginalFileName())
                .submittedAt(document.getSubmittedAt())
                .reviewedAt(document.getReviewedAt())
                .expiresAt(document.getExpiresAt())
                .companyId(company.getId())
                .companyName(company.getName())
                .companyTaxCode(company.getTaxCode())
                .submittedByUserId(document.getSubmittedBy())
                .submittedByName(submitter == null ? null : submitter.name())
                .submittedByEmail(submitter == null ? null : submitter.email())
                .build();
    }

    public AdminCompanyFactsResource toCompanyFacts(
            Company company, CompanyProfile profile, boolean profileComplete, int memberCount) {
        AdminCompanyFactsResource.AdminCompanyFactsResourceBuilder facts =
                AdminCompanyFactsResource.builder()
                        .id(company.getId())
                        .name(company.getName())
                        .taxCode(company.getTaxCode())
                        .registeredAddress(company.getAddress())
                        .profileComplete(profileComplete)
                        .memberCount(memberCount)
                        .createdAt(company.getCreatedAt());
        if (profile != null) {
            facts.tradingName(profile.getTradingName())
                    .businessType(profile.getBusinessType())
                    .industry(profile.getIndustry())
                    .size(profile.getSize())
                    .address(profile.getAddress())
                    .email(profile.getEmail())
                    .phone(profile.getPhone())
                    .website(profile.getWebsite());
        }
        return facts.build();
    }

    public CompanyMemberResource toMemberResource(
            CompanyMember member,
            RecruiterResource recruiter,
            boolean canPublish,
            boolean userAgreementAccepted) {
        return CompanyMemberResource.builder()
                .userId(member.getUserId())
                .name(recruiter == null ? null : recruiter.name())
                .email(recruiter == null ? null : recruiter.email())
                .status(member.getStatus())
                .joinedAt(member.getJoinedAt())
                .canPublish(canPublish)
                .phoneVerified(recruiter != null && recruiter.phoneVerified())
                .userAgreementAccepted(userAgreementAccepted)
                .build();
    }
}
