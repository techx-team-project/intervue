package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminBusinessVerificationListResource(
        Long id,
        BusinessDocumentType documentType,
        DocumentReviewStatus reviewStatus,
        String originalFileName,
        Instant submittedAt,
        Instant reviewedAt,
        Instant expiresAt,
        Long companyId,
        String companyName,
        String companyTaxCode,
        Long submittedByUserId,
        String submittedByName,
        String submittedByEmail) {}
