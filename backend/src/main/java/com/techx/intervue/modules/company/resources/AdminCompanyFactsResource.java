package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.techx.intervue.modules.company.enums.BusinessType;
import com.techx.intervue.modules.company.enums.CompanyVerificationStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminCompanyFactsResource(
        Long id,
        String name,
        String tradingName,
        String taxCode,
        BusinessType businessType,
        String industry,
        String size,
        String address,
        String email,
        String phone,
        String website,
        CompanyVerificationStatus verificationStatus,
        Instant verifiedAt,
        boolean profileComplete,
        int memberCount,
        Instant createdAt) {

    @JsonProperty("verified")
    public boolean verified() {
        return verificationStatus == CompanyVerificationStatus.VERIFIED;
    }
}
