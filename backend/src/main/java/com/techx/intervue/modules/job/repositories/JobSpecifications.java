package com.techx.intervue.modules.job.repositories;

import com.techx.intervue.common.persistence.SpecificationSupport;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.enums.SalaryCurrency;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.requests.SearchRecruiterJobsRequest;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
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

    public static Specification<Job> publicListing(SearchJobsRequest request, LocalDate today) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(builder.equal(root.get("status"), JobStatus.PUBLISHED));
            predicates.add(builder.greaterThanOrEqualTo(root.get("deadline"), today));
            if (hasText(request.q())) {
                String pattern = SpecificationSupport.containsPattern(request.q());
                predicates.add(
                        builder.or(
                                builder.like(builder.lower(root.get("title")), pattern),
                                builder.like(builder.lower(root.get("companyName")), pattern)));
            }
            if (hasText(request.city())) {
                predicates.add(builder.equal(root.get("city"), request.city().trim()));
            }
            if (request.contractType() != null) {
                predicates.add(builder.equal(root.get("contractType"), request.contractType()));
            }
            if (request.workingArrangement() != null) {
                predicates.add(
                        builder.equal(
                                root.get("workingArrangement"), request.workingArrangement()));
            }
            if (request.level() != null) {
                predicates.add(builder.equal(root.get("level"), request.level()));
            }
            if (request.salaryFrom() != null) {
                SalaryCurrency currency =
                        request.currency() == null ? SalaryCurrency.VND : request.currency();
                predicates.add(builder.isFalse(root.get("salaryNegotiable")));
                predicates.add(builder.equal(root.get("salaryCurrency"), currency));
                predicates.add(
                        builder.greaterThanOrEqualTo(root.get("salaryMax"), request.salaryFrom()));
            }
            if (request.skillIds() != null && !request.skillIds().isEmpty()) {
                query.distinct(true);
                Join<Job, Skill> skills = root.join("skills");
                predicates.add(skills.get("id").in(request.skillIds()));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
