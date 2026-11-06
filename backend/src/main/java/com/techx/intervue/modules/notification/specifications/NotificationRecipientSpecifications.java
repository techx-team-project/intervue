package com.techx.intervue.modules.notification.specifications;

import com.techx.intervue.modules.notification.entities.Notification;
import com.techx.intervue.modules.notification.entities.NotificationRecipient;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.requests.SearchNotificationRequest;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class NotificationRecipientSpecifications {

    private NotificationRecipientSpecifications() {}

    public static Specification<NotificationRecipient> inbox(
            RecipientType recipientType, Long recipientId, SearchNotificationRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("recipientType"), recipientType));
            predicates.add(cb.equal(root.get("recipientId"), recipientId));
            predicates.add(cb.isNull(root.get("archivedAt")));

            if (request != null) {
                if (request.onlyUnread()) {
                    predicates.add(cb.isNull(root.get("readAt")));
                }
                if (request.category() != null) {
                    Join<NotificationRecipient, Notification> notification =
                            root.join("notification");
                    predicates.add(cb.equal(notification.get("category"), request.category()));
                }
                if (request.from() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), request.from()));
                }
                if (request.to() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), request.to()));
                }
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
