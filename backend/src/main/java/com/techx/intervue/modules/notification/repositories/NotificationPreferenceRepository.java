package com.techx.intervue.modules.notification.repositories;

import com.techx.intervue.modules.notification.entities.NotificationPreference;
import com.techx.intervue.modules.notification.enums.NotificationCategory;
import com.techx.intervue.modules.notification.enums.RecipientType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationPreferenceRepository
        extends JpaRepository<NotificationPreference, Long> {

    List<NotificationPreference> findByRecipientTypeAndRecipientId(
            RecipientType recipientType, Long recipientId);

    Optional<NotificationPreference> findByRecipientTypeAndRecipientIdAndCategory(
            RecipientType recipientType, Long recipientId, NotificationCategory category);

    List<NotificationPreference> findByRecipientTypeAndRecipientIdInAndCategoryAndInAppFalse(
            RecipientType recipientType, List<Long> recipientIds, NotificationCategory category);
}
