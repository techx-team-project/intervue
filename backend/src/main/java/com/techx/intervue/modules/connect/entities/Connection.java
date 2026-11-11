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
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
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

    public static final int MAX_INVITES_PER_PAIR = 2;
    public static final Duration REINVITE_COOLDOWN = Duration.ofHours(24);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_id", nullable = false, updatable = false, unique = true, length = 36)
    private String publicId;

    @PrePersist
    void ensurePublicId() {
        if (publicId == null || publicId.isBlank()) {
            publicId = UUID.randomUUID().toString();
        }
    }

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

    @Column(name = "initiated_by_recruiter_id", nullable = false)
    private Long initiatedByRecruiterId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ConnectionStatus status;

    @Builder.Default
    @Column(name = "invite_count", nullable = false)
    private int inviteCount = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "blocked_by_actor_type", length = 20)
    private ConnectActorType blockedByActorType;

    @Column(name = "blocked_by_actor_id")
    private Long blockedByActorId;

    @Column(name = "blocked_at")
    private Instant blockedAt;

    @Column(name = "invited_at", nullable = false)
    private Instant invitedAt;

    @Column(name = "responded_at")
    private Instant respondedAt;

    @Column(name = "content_hidden_at")
    private Instant contentHiddenAt;

    @Column(name = "last_message_at")
    private Instant lastMessageAt;

    @Column(name = "candidate_last_read_message_id")
    private Long candidateLastReadMessageId;

    @Column(name = "candidate_last_read_at")
    private Instant candidateLastReadAt;

    @Column(name = "recruiter_last_read_message_id")
    private Long recruiterLastReadMessageId;

    @Column(name = "recruiter_last_read_at")
    private Instant recruiterLastReadAt;

    public boolean hasReachedInviteLimit() {
        return inviteCount >= MAX_INVITES_PER_PAIR;
    }

    public Instant reinviteAvailableAt() {
        if (status != ConnectionStatus.DECLINED || hasReachedInviteLimit() || respondedAt == null) {
            return null;
        }
        return respondedAt.plus(REINVITE_COOLDOWN);
    }
}
