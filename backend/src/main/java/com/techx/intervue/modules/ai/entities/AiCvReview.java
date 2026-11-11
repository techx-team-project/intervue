package com.techx.intervue.modules.ai.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.job.entities.Job;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "ai_cv_reviews")
public class AiCvReview extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "candidate_profile_id", nullable = false)
    private CandidateProfile candidateProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    private Job job;

    @Column(name = "review_level", nullable = false)
    @Builder.Default
    private Integer reviewLevel = 1;

    @Column(name = "target_position", length = 150)
    private String targetPosition;

    @Column(name = "file_hash", nullable = false, length = 64)
    private String fileHash;

    @Column(name = "overall_score")
    private Integer overallScore;

    @Column(name = "job_fit_score")
    private Integer jobFitScore;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "comments_json", columnDefinition = "JSON", nullable = false)
    private String commentsJson;

    @Column(name = "requirement_matches_json", columnDefinition = "JSON")
    private String requirementMatchesJson;

    @Column(name = "model_version", nullable = false, length = 100)
    private String modelVersion;

    @Column(name = "prompt_version", nullable = false, length = 50)
    private String promptVersion;

    @Column(name = "charged_credits", nullable = false)
    @Builder.Default
    private Integer chargedCredits = 0;

    @Column(name = "is_refunded", nullable = false)
    @Builder.Default
    private boolean isRefunded = false;
}
