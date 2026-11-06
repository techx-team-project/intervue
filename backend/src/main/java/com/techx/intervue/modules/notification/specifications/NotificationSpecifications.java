package com.techx.intervue.modules.notification.specifications;

import com.techx.intervue.common.persistence.SpecificationSupport;
import com.techx.intervue.modules.notification.entities.Notification;
import com.techx.intervue.modules.notification.enums.NotificationKind;
import com.techx.intervue.modules.notification.requests.SearchBroadcastRequest;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class NotificationSpecifications {

    private NotificationSpecifications() {}

    public static Specification<Notification> broadcasts(SearchBroadcastRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("kind"), NotificationKind.BROADCAST));

            if (request != null) {
                if (request.status() != null) {
                    predicates.add(cb.equal(root.get("status"), request.status()));
                }
                if (request.audience() != null) {
                    predicates.add(cb.equal(root.get("audience"), request.audience()));
                }
                if (request.q() != null && !request.q().isBlank()) {
                    String pattern = SpecificationSupport.containsPattern(request.q());
                    predicates.add(
                            cb.or(
                                    cb.like(cb.lower(root.get("title")), pattern),
                                    cb.like(cb.lower(root.get("summary")), pattern)));
                }
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
