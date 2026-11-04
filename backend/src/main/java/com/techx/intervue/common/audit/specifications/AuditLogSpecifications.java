package com.techx.intervue.common.audit.specifications;

import com.techx.intervue.common.audit.entities.AuditLog;
import com.techx.intervue.common.audit.requests.SearchAuditLogRequest;
import com.techx.intervue.common.persistence.SpecificationSupport;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class AuditLogSpecifications {

    private AuditLogSpecifications() {}

    public static Specification<AuditLog> from(SearchAuditLogRequest request) {
        return (root, query, cb) -> {
            if (request == null) {
                return cb.conjunction();
            }

            List<Predicate> predicates = new ArrayList<>();

            if (request.actorType() != null) {
                predicates.add(cb.equal(root.get("actorType"), request.actorType()));
            }
            if (request.action() != null) {
                predicates.add(cb.equal(root.get("action"), request.action()));
            }
            if (request.targetType() != null) {
                predicates.add(cb.equal(root.get("targetType"), request.targetType()));
            }
            if (request.targetId() != null) {
                predicates.add(cb.equal(root.get("targetId"), request.targetId()));
            }
            if (request.from() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), request.from()));
            }
            if (request.to() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), request.to()));
            }
            if (request.q() != null && !request.q().isBlank()) {
                String pattern = SpecificationSupport.containsPattern(request.q());
                Predicate emailMatch = cb.like(cb.lower(root.get("actorEmail")), pattern);
                Predicate reasonMatch = cb.like(cb.lower(root.get("reason")), pattern);
                Predicate detailMatch = cb.like(cb.lower(root.get("detail")), pattern);
                Predicate traceMatch = cb.like(cb.lower(root.get("traceId")), pattern);
                predicates.add(cb.or(emailMatch, reasonMatch, detailMatch, traceMatch));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }
}
