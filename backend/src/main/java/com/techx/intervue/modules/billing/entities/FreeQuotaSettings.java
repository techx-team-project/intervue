package com.techx.intervue.modules.billing.entities;

import com.techx.intervue.common.entities.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "free_quota_settings")
public class FreeQuotaSettings extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ai_resume_match_free_per_month", nullable = false)
    @Builder.Default
    private Integer aiResumeMatchFreePerMonth = 30;

    @Column(name = "ai_jd_generate_free_per_month", nullable = false)
    @Builder.Default
    private Integer aiJdGenerateFreePerMonth = 10;

    @Column(name = "cv_review_free_per_day", nullable = false)
    @Builder.Default
    private Integer cvReviewFreePerDay = 3;

    @Column(name = "candidate_starter_credits", nullable = false)
    @Builder.Default
    private Integer candidateStarterCredits = 5;

    @Column(name = "connect_daily_invite_limit", nullable = false)
    @Builder.Default
    private Integer connectDailyInviteLimit = 100;

    @Column(name = "company_free_photo_limit", nullable = false)
    @Builder.Default
    private Integer companyFreePhotoLimit = 3;

    @Column(name = "require_job_slot", nullable = false)
    @Builder.Default
    private boolean requireJobSlot = false;

    @Column(name = "job_free_active_limit", nullable = false)
    @Builder.Default
    private Integer jobFreeActiveLimit = 3;

    @Column(name = "job_free_max_days", nullable = false)
    @Builder.Default
    private Integer jobFreeMaxDays = 60;

    @Column(name = "job_review_first_count", nullable = false)
    @Builder.Default
    private Integer jobReviewFirstCount = 3;
}
