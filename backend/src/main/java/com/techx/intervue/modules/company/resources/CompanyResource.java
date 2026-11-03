package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.company.enums.BusinessType;
import com.techx.intervue.modules.company.enums.CompanyMemberRole;
import com.techx.intervue.modules.company.enums.CompanyVerificationStatus;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CompanyResource(
        Long id,
        String name,
        String tradingName,
        String taxCode,
        BusinessType businessType,
        String industry,
        String website,
        String market,
        String targetCustomers,
        String size,
        String email,
        String phone,
        String address,
        String description,
        String benefits,
        String logoUrl,
        List<CompanyPhotoResource> photos,
        CompanyVerificationStatus verificationStatus,
        boolean verified,
        Instant verifiedAt,
        CompanyMemberRole myRole,
        boolean legalFieldsLocked,
        boolean profileComplete,
        List<String> missingFields,
        Instant createdAt,
        Instant updatedAt) {}
