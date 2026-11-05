package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record BusinessDocumentResource(
        Long id,
        BusinessDocumentType documentType,
        DocumentReviewStatus reviewStatus,
        String originalFileName,
        long fileSizeBytes,
        String contentType,
        Instant submittedAt,
        boolean submittedByMe,
        Instant reviewedAt,
        String reviewReason,
        Instant expiresAt,
        String storagePublicId,
        String identityStoragePublicId,
        String identityFileName,
        String identityBackStoragePublicId,
        String identityBackFileName) {}
