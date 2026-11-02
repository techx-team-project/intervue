package com.techx.intervue.modules.user.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.user.enums.RestrictionKind;
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
@Table(name = "user_restrictions")
public class UserRestriction extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RestrictionKind kind;

    @Column(nullable = false)
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @Column(name = "notify_user", nullable = false)
    @Builder.Default
    private boolean notifyUser = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "lifted_at")
    private Instant liftedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lifted_by")
    private User liftedBy;

    @Column(name = "lift_reason")
    private String liftReason;

    public boolean isLifted() {
        return liftedAt != null;
    }

    public boolean isExpired() {
        return expiresAt != null && expiresAt.isBefore(Instant.now());
    }
}
