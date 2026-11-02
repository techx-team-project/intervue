package com.techx.intervue.modules.user.repositories;

import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.entities.UserRole;
import com.techx.intervue.modules.user.requests.SearchUsersRequest;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecifications {

    private static final int MAX_ID_DIGITS = 18;

    private UserSpecifications() {}

    public static Specification<User> matching(SearchUsersRequest request) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.q() != null && !request.q().isBlank()) {
                String keyword = request.q().trim().toLowerCase();
                String pattern = "%" + keyword + "%";
                List<Predicate> matches = new ArrayList<>();
                matches.add(builder.like(builder.lower(root.get("name")), pattern));
                matches.add(builder.like(builder.lower(root.get("email")), pattern));
                matches.add(builder.like(builder.lower(root.get("phone")), pattern));
                if (isUserId(keyword)) {
                    matches.add(builder.equal(root.get("id"), Long.valueOf(keyword)));
                }
                predicates.add(builder.or(matches.toArray(Predicate[]::new)));
            }

            if (request.status() != null) {
                predicates.add(builder.equal(root.get("status"), request.status()));
            }

            if (request.emailVerified() != null) {
                Predicate verified = root.get("emailVerifiedAt").isNotNull();
                predicates.add(request.emailVerified() ? verified : builder.not(verified));
            }

            if (request.role() != null) {
                // A join would duplicate rows and break the page count, so holding a
                // role is expressed as a subquery instead.
                Subquery<Long> holders = query.subquery(Long.class);
                Root<UserRole> grant = holders.from(UserRole.class);
                holders.select(grant.get("user").get("id"))
                        .where(
                                builder.equal(grant.get("role").get("name"), request.role()),
                                builder.or(
                                        grant.get("expiresAt").isNull(),
                                        builder.greaterThan(
                                                grant.<Instant>get("expiresAt"), Instant.now())));
                predicates.add(root.get("id").in(holders));
            }

            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static boolean isUserId(String keyword) {
        return keyword.length() <= MAX_ID_DIGITS && keyword.chars().allMatch(Character::isDigit);
    }
}
