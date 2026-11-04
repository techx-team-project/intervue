package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.company.enums.AgreementAcceptanceMode;
import com.techx.intervue.modules.company.enums.AgreementScope;
import com.techx.intervue.modules.company.enums.AgreementStatus;
import com.techx.intervue.modules.company.enums.AgreementType;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminCompanyAgreementResource(
        Long id,
        AgreementScope scope,
        Long companyId,
        String companyName,
        String companyTaxCode,
        Long signedByUserId,
        String signedByName,
        String signedByEmail,
        AgreementType agreementType,
        AgreementAcceptanceMode acceptanceMode,
        String version,
        AgreementStatus status,
        Instant acceptedAt,
        String storagePublicId) {}
