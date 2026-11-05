package com.techx.intervue.modules.company.mappers;

import com.techx.intervue.modules.company.entities.BusinessDocument;
import com.techx.intervue.modules.company.entities.Company;
import com.techx.intervue.modules.company.entities.CompanyMember;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationListResource;
import com.techx.intervue.modules.company.resources.AdminCompanyFactsResource;
import com.techx.intervue.modules.company.resources.CompanyMemberResource;
import com.techx.intervue.modules.user.resources.UserResource;
import org.springframework.stereotype.Component;

@Component
public class AdminBusinessVerificationMapper {

    public AdminBusinessVerificationListResource toListResource(
            BusinessDocument document, UserResource submitter) {
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
                .companyVerificationStatus(company.getVerificationStatus())
                .submittedByUserId(document.getSubmittedBy())
                .submittedByName(submitter == null ? null : submitter.name())
                .submittedByEmail(submitter == null ? null : submitter.email())
                .build();
    }

    public AdminCompanyFactsResource toCompanyFacts(
            Company company, boolean profileComplete, int memberCount) {
        return AdminCompanyFactsResource.builder()
                .id(company.getId())
                .name(company.getName())
                .tradingName(company.getTradingName())
                .taxCode(company.getTaxCode())
                .businessType(company.getBusinessType())
                .industry(company.getIndustry())
                .size(company.getSize())
                .address(company.getAddress())
                .email(company.getEmail())
                .phone(company.getPhone())
                .website(company.getWebsite())
                .verificationStatus(company.getVerificationStatus())
                .verifiedAt(company.getVerifiedAt())
                .profileComplete(profileComplete)
                .memberCount(memberCount)
                .createdAt(company.getCreatedAt())
                .build();
    }

    public AdminCompanyFactsResource toCompanyFacts(Company company, boolean profileComplete) {
        return toCompanyFacts(company, profileComplete, 1);
    }

    public CompanyMemberResource toMemberResource(
            CompanyMember member,
            UserResource user,
            boolean canPublish,
            boolean phoneVerified,
            boolean userAgreementAccepted) {
        return CompanyMemberResource.builder()
                .userId(member.getUserId())
                .name(user == null ? null : user.name())
                .email(user == null ? null : user.email())
                .role(member.getRole())
                .status(member.getStatus())
                .joinedAt(member.getJoinedAt())
                .canPublish(canPublish)
                .phoneVerified(phoneVerified)
                .userAgreementAccepted(userAgreementAccepted)
                .build();
    }

    public CompanyMemberResource toMemberResource(
            CompanyMember member, UserResource user, boolean canPublish) {
        return toMemberResource(
                member, user, canPublish, user != null && user.phoneVerified(), false);
    }
}
