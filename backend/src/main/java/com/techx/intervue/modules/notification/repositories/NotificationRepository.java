package com.techx.intervue.modules.notification.repositories;

import com.techx.intervue.modules.notification.entities.Notification;
import com.techx.intervue.modules.notification.enums.BroadcastStatus;
import com.techx.intervue.modules.notification.enums.NotificationKind;
import java.time.Instant;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {

    List<Notification> findByKindAndStatusAndScheduledAtLessThanEqual(
            NotificationKind kind, BroadcastStatus status, Instant threshold);

    List<Notification> findByKindAndStatusAndCreatedAtLessThan(
            NotificationKind kind, BroadcastStatus status, Instant threshold);
}
