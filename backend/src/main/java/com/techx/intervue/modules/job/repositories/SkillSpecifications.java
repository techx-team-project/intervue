package com.techx.intervue.modules.job.repositories;

import com.techx.intervue.common.persistence.SpecificationSupport;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.requests.AdminSearchSkillsRequest;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class SkillSpecifications {

    private SkillSpecifications() {}

    public static Specification<Skill> matching(AdminSearchSkillsRequest request) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (request.q() != null && !request.q().isBlank()) {
                predicates.add(
                        builder.like(
                                builder.lower(root.get("name")),
                                SpecificationSupport.containsPattern(request.q())));
            }
            if (request.group() != null) {
                predicates.add(builder.equal(root.get("group"), request.group()));
            }
            if (request.active() != null) {
                predicates.add(builder.equal(root.get("active"), request.active()));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
