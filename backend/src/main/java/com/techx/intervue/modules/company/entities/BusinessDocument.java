package com.techx.intervue.modules.company.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "business_documents")
public class BusinessDocument extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "submitted_by", nullable = false)
    private Long submittedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false, length = 40)
    private BusinessDocumentType documentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "review_status", nullable = false, length = 30)
    @Builder.Default
    private DocumentReviewStatus reviewStatus = DocumentReviewStatus.PENDING_REVIEW;

    @Column(name = "storage_public_id", nullable = false)
    private String storagePublicId;

    @Column(name = "identity_storage_public_id")
    private String identityStoragePublicId;

    @Column(name = "identity_back_storage_public_id")
    private String identityBackStoragePublicId;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "identity_file_name")
    private String identityFileName;

    @Column(name = "identity_back_file_name")
    private String identityBackFileName;

    @Column(name = "file_size_bytes", nullable = false)
    private long fileSizeBytes;

    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;

    @Column(name = "checksum_sha256", nullable = false, columnDefinition = "CHAR(64)")
    private String checksumSha256;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "review_reason", length = 500)
    private String reviewReason;

    @Column(name = "expires_at")
    private Instant expiresAt;

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(Instant.now());
    }

    public boolean isEffective() {
        return reviewStatus == DocumentReviewStatus.APPROVED && !isExpired();
    }
}
