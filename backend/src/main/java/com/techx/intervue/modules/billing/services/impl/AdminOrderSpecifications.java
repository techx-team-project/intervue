package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.billing.requests.SearchAdminOrdersRequest;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class AdminOrderSpecifications {

    private AdminOrderSpecifications() {}

    public static Specification<Order> matching(SearchAdminOrdersRequest request) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (request.code() != null && !request.code().isBlank()) {
                predicates.add(
                        builder.like(
                                builder.lower(root.get("code")),
                                "%" + request.code().trim().toLowerCase() + "%"));
            }
            if (request.status() != null) {
                predicates.add(builder.equal(root.get("status"), request.status()));
            }
            if (request.companyId() != null) {
                predicates.add(builder.equal(root.get("companyId"), request.companyId()));
            }
            if (request.from() != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("createdAt"), request.from()));
            }
            if (request.to() != null) {
                predicates.add(builder.lessThanOrEqualTo(root.get("createdAt"), request.to()));
            }
            return predicates.isEmpty() ? null : builder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
