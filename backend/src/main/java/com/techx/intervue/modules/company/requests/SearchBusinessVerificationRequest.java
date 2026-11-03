package com.techx.intervue.modules.company.requests;

import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import jakarta.validation.constraints.Size;

public record SearchBusinessVerificationRequest(
        @Size(max = 100) String q,
        DocumentReviewStatus reviewStatus,
        BusinessDocumentType documentType) {}
