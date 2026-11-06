package com.techx.intervue.modules.notification.repositories;

import com.techx.intervue.modules.notification.entities.NotificationRecipient;
import com.techx.intervue.modules.notification.enums.NotificationCategory;
import com.techx.intervue.modules.notification.enums.RecipientType;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRecipientRepository
        extends JpaRepository<NotificationRecipient, Long>,
                JpaSpecificationExecutor<NotificationRecipient> {

    interface UnreadCategoryCount {
        NotificationCategory getCategory();

        long getTotal();
    }

    @Override
    @EntityGraph(attributePaths = "notification")
    Page<NotificationRecipient> findAll(
            Specification<NotificationRecipient> spec, Pageable pageable);

    @EntityGraph(attributePaths = "notification")
    Optional<NotificationRecipient> findByIdAndRecipientTypeAndRecipientId(
            Long id, RecipientType recipientType, Long recipientId);

    long countByRecipientTypeAndRecipientIdAndReadAtIsNullAndArchivedAtIsNull(
            RecipientType recipientType, Long recipientId);

    long countByNotificationId(Long notificationId);

    @Query(
            """
            SELECT n.category AS category, COUNT(r) AS total
            FROM NotificationRecipient r
            JOIN r.notification n
            WHERE r.recipientType = :recipientType
              AND r.recipientId = :recipientId
              AND r.readAt IS NULL
              AND r.archivedAt IS NULL
            GROUP BY n.category
            """)
    List<UnreadCategoryCount> countUnreadByCategory(
            @Param("recipientType") RecipientType recipientType,
            @Param("recipientId") Long recipientId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            """
            UPDATE NotificationRecipient r
            SET r.readAt = :now, r.seenAt = COALESCE(r.seenAt, :now), r.updatedAt = :now
            WHERE r.recipientType = :recipientType
              AND r.recipientId = :recipientId
              AND r.readAt IS NULL
              AND r.archivedAt IS NULL
            """)
    int markAllRead(
            @Param("recipientType") RecipientType recipientType,
            @Param("recipientId") Long recipientId,
            @Param("now") Instant now);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            """
            UPDATE NotificationRecipient r
            SET r.readAt = :now, r.seenAt = COALESCE(r.seenAt, :now), r.updatedAt = :now
            WHERE r.recipientType = :recipientType
              AND r.recipientId = :recipientId
              AND r.readAt IS NULL
              AND r.archivedAt IS NULL
              AND r.notification.category = :category
            """)
    int markAllReadInCategory(
            @Param("recipientType") RecipientType recipientType,
            @Param("recipientId") Long recipientId,
            @Param("category") NotificationCategory category,
            @Param("now") Instant now);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
            """
            UPDATE NotificationRecipient r
            SET r.seenAt = :now, r.updatedAt = :now
            WHERE r.recipientType = :recipientType
              AND r.recipientId = :recipientId
              AND r.seenAt IS NULL
              AND r.archivedAt IS NULL
            """)
    int markAllSeen(
            @Param("recipientType") RecipientType recipientType,
            @Param("recipientId") Long recipientId,
            @Param("now") Instant now);

    @Modifying
    int deleteByReadAtIsNotNullAndReadAtLessThan(Instant threshold);

    @Modifying
    int deleteByArchivedAtIsNotNullAndArchivedAtLessThan(Instant threshold);
}
