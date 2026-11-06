package com.techx.intervue.modules.company.events;

import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import java.time.Instant;

public record BusinessDocumentReviewedEvent(
        Long recruiterId,
        String email,
        String name,
        DocumentReviewStatus outcome,
        BusinessDocumentType documentType,
        String companyName,
        String reason,
        Instant expiresAt) {}
