package com.techx.intervue.modules.job.repositories;

import com.techx.intervue.common.persistence.SpecificationSupport;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.requests.SearchRecruiterJobsRequest;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class JobSpecifications {

    private JobSpecifications() {}

    public static Specification<Job> ownedBy(Long recruiterId, SearchRecruiterJobsRequest request) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(builder.equal(root.get("recruiterId"), recruiterId));
            if (request.status() != null) {
                predicates.add(builder.equal(root.get("status"), request.status()));
            }
            if (request.q() != null && !request.q().isBlank()) {
                predicates.add(
                        builder.like(
                                builder.lower(root.get("title")),
                                SpecificationSupport.containsPattern(request.q())));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
