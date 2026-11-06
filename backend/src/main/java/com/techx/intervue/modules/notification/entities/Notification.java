package com.techx.intervue.modules.notification.entities;

import com.techx.intervue.common.entities.BaseEntity;
import com.techx.intervue.modules.notification.enums.BroadcastAudience;
import com.techx.intervue.modules.notification.enums.BroadcastStatus;
import com.techx.intervue.modules.notification.enums.NotificationCategory;
import com.techx.intervue.modules.notification.enums.NotificationKind;
import com.techx.intervue.modules.notification.enums.NotificationSeverity;
import com.techx.intervue.modules.notification.enums.NotificationType;
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
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notifications")
public class Notification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private NotificationKind kind;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 64)
    private NotificationType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 16)
    private BroadcastAudience audience;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private NotificationCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private NotificationSeverity severity;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String summary;

    @Column(name = "body_markdown", columnDefinition = "TEXT")
    private String bodyMarkdown;

    @Column(name = "action_url", length = 500)
    private String actionUrl;

    @Column(name = "action_label", length = 100)
    private String actionLabel;

    @Enumerated(EnumType.STRING)
    @Column(length = 16)
    private BroadcastStatus status;

    @Column(name = "scheduled_at")
    private Instant scheduledAt;

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(name = "created_by_admin_id")
    private Long createdByAdminId;
}
