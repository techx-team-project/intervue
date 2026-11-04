package com.techx.intervue.modules.company.mappers;

import com.techx.intervue.modules.company.entities.BusinessDocument;
import com.techx.intervue.modules.company.enums.VerificationStepStatus;
import com.techx.intervue.modules.company.resources.BusinessDocumentResource;
import org.springframework.stereotype.Component;

@Component
public class BusinessDocumentMapper {

    public BusinessDocumentResource toResource(BusinessDocument document, Long viewerId) {
        return BusinessDocumentResource.builder()
                .id(document.getId())
                .documentType(document.getDocumentType())
                .reviewStatus(document.getReviewStatus())
                .originalFileName(document.getOriginalFileName())
                .fileSizeBytes(document.getFileSizeBytes())
                .contentType(document.getContentType())
                .submittedAt(document.getSubmittedAt())
                .submittedByMe(document.getSubmittedBy().equals(viewerId))
                .reviewedAt(document.getReviewedAt())
                .reviewReason(document.getReviewReason())
                .expiresAt(document.getExpiresAt())
                .build();
    }

    public VerificationStepStatus toStepStatus(BusinessDocument document) {
        return switch (document.getReviewStatus()) {
            case PENDING_REVIEW -> VerificationStepStatus.IN_REVIEW;
            case APPROVED ->
                    document.isExpired()
                            ? VerificationStepStatus.EXPIRED
                            : VerificationStepStatus.APPROVED;
            case REJECTED -> VerificationStepStatus.REJECTED;
            case MORE_INFO_REQUIRED -> VerificationStepStatus.ACTION_REQUIRED;
            case REVOKED -> VerificationStepStatus.REVOKED;
            case EXPIRED -> VerificationStepStatus.EXPIRED;
        };
    }
}
