package com.techx.intervue.modules.application.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.application.enums.InterviewFormat;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "interviews")
public class Interview extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_id", nullable = false, updatable = false)
    private Long applicationId;

    @Column(name = "candidate_id", nullable = false, updatable = false)
    private Long candidateId;

    @Column(name = "company_id", nullable = false, updatable = false)
    private Long companyId;

    @Column(name = "scheduled_by", nullable = false, updatable = false)
    private Long scheduledBy;

    @Column(name = "starts_at", nullable = false)
    private Instant startsAt;

    @Column(name = "duration_minutes", nullable = false)
    private int durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InterviewFormat format;

    @Column(nullable = false, length = 500)
    private String location;

    @Column(length = 1000)
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private InterviewStatus status;

    @Column(name = "proposed_starts_at")
    private Instant proposedStartsAt;

    @Column(name = "candidate_message", length = 500)
    private String candidateMessage;

    @Column(name = "cancel_reason", length = 500)
    private String cancelReason;

    @Column(name = "reminder_24h_sent", nullable = false)
    private boolean reminder24hSent;

    @Column(name = "reminder_1h_sent", nullable = false)
    private boolean reminder1hSent;
}
