package com.techx.intervue.modules.application.repositories;

import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.requests.SearchApplicationsRequest;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class ApplicationSpecifications {

    private ApplicationSpecifications() {}

    public static Specification<Application> ownedBy(
            Long candidateId, SearchApplicationsRequest request) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(builder.equal(root.get("candidateId"), candidateId));
            if (request.status() != null) {
                predicates.add(builder.equal(root.get("status"), request.status()));
            }
            if (request.jobId() != null) {
                predicates.add(builder.equal(root.get("jobId"), request.jobId()));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }
}
