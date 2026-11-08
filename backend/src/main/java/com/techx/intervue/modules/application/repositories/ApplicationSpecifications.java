package com.techx.intervue.modules.application.repositories;

import com.techx.intervue.common.persistence.SpecificationSupport;
import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.requests.SearchApplicationsRequest;
import com.techx.intervue.modules.application.requests.SearchRecruiterApplicationsRequest;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class ApplicationSpecifications {

    private ApplicationSpecifications() {}

    public static Specification<Application> forCompany(
            Long companyId, SearchRecruiterApplicationsRequest request) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(builder.equal(root.get("companyId"), companyId));
            predicates.add(builder.notEqual(root.get("status"), ApplicationStatus.DRAFT));
            if (request.status() != null) {
                predicates.add(builder.equal(root.get("status"), request.status()));
            }
            if (request.jobId() != null) {
                predicates.add(builder.equal(root.get("jobId"), request.jobId()));
            }
            if (request.q() != null && !request.q().isBlank()) {
                String pattern = SpecificationSupport.containsPattern(request.q());
                predicates.add(
                        builder.or(
                                builder.like(builder.lower(root.get("candidateName")), pattern),
                                builder.like(builder.lower(root.get("candidateEmail")), pattern),
                                builder.like(builder.lower(root.get("jobTitle")), pattern)));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

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
