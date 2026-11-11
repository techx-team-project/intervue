package com.techx.intervue.modules.candidate.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.candidate.enums.IdentityVerificationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.time.LocalDate;
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
@Table(name = "identity_verifications")
public class IdentityVerification extends BaseEntity {

    public static final int DEFAULT_ATTEMPT_LIMIT = 5;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, updatable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IdentityVerificationStatus status;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "id_number_hash", nullable = false, columnDefinition = "CHAR(64)")
    private String idNumberHash;

    @Column(name = "id_number_last4", nullable = false, columnDefinition = "CHAR(4)")
    private String idNumberLast4;

    @Column(name = "front_public_id", nullable = false)
    private String frontPublicId;

    @Column(name = "back_public_id", nullable = false)
    private String backPublicId;

    @Column(name = "selfie_public_id", nullable = false)
    private String selfiePublicId;

    @Column(name = "submitted_at", nullable = false)
    private Instant submittedAt;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "reject_reason", length = 500)
    private String rejectReason;

    @Column(name = "rejection_count", nullable = false)
    private int rejectionCount;

    @Column(name = "attempt_limit", nullable = false)
    @Builder.Default
    private int attemptLimit = DEFAULT_ATTEMPT_LIMIT;

    @Column(name = "manual_review_requested_at")
    private Instant manualReviewRequestedAt;

    public int attemptsLeft() {
        return Math.max(attemptLimit - rejectionCount, 0);
    }
}
