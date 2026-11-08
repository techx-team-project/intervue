package com.techx.intervue.modules.application.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "applications")
public class Application extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_id", nullable = false, updatable = false)
    private Long jobId;

    @Column(name = "candidate_id", nullable = false, updatable = false)
    private Long candidateId;

    @Column(name = "company_id", nullable = false, updatable = false)
    private Long companyId;

    @Column(name = "candidate_name", nullable = false, updatable = false, length = 150)
    private String candidateName;

    @Column(name = "candidate_email", nullable = false, updatable = false)
    private String candidateEmail;

    @Column(name = "job_title", nullable = false, updatable = false)
    private String jobTitle;

    @Column(name = "company_name", nullable = false, updatable = false)
    private String companyName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status;

    @Column(name = "draft_resume_id")
    private Long draftResumeId;

    @Column(name = "cv_storage_public_id")
    private String cvStoragePublicId;

    @Column(name = "cv_file_name")
    private String cvFileName;

    @Column(name = "cv_content_type", length = 100)
    private String cvContentType;

    @Column(name = "cv_file_size_bytes")
    private Long cvFileSizeBytes;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(name = "viewed_at")
    private Instant viewedAt;

    @BatchSize(size = 50)
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ApplicationAnswer> answers = new ArrayList<>();

    @BatchSize(size = 50)
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL)
    @OrderBy("createdAt ASC, id ASC")
    @Builder.Default
    private List<ApplicationStatusHistory> history = new ArrayList<>();
}
