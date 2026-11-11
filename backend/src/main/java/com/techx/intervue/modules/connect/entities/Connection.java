package com.techx.intervue.modules.connect.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
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
@Table(name = "connections")
public class Connection extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "candidate_id", nullable = false, updatable = false)
    private Long candidateId;

    @Column(name = "candidate_name", nullable = false, updatable = false, length = 150)
    private String candidateName;

    @Column(name = "candidate_email", nullable = false, updatable = false)
    private String candidateEmail;

    @Column(name = "company_id", nullable = false, updatable = false)
    private Long companyId;

    @Column(name = "company_name", nullable = false, updatable = false)
    private String companyName;

    @Column(name = "initiated_by_recruiter_id", nullable = false, updatable = false)
    private Long initiatedByRecruiterId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ConnectionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "blocked_by_actor_type", length = 20)
    private ConnectActorType blockedByActorType;

    @Column(name = "blocked_by_actor_id")
    private Long blockedByActorId;

    @Column(name = "blocked_at")
    private Instant blockedAt;

    @Column(name = "invited_at", nullable = false, updatable = false)
    private Instant invitedAt;

    @Column(name = "responded_at")
    private Instant respondedAt;

    @Column(name = "content_hidden_at")
    private Instant contentHiddenAt;

    @Column(name = "last_message_at")
    private Instant lastMessageAt;
}
