package com.techx.intervue.modules.job.repositories;

import com.techx.intervue.common.persistence.SpecificationSupport;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.enums.SalaryCurrency;
import com.techx.intervue.modules.job.requests.AdminSearchJobsRequest;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.requests.SearchRecruiterJobsRequest;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.time.Instant;
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

    public static Specification<Job> adminListing(AdminSearchJobsRequest request) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(builder.notEqual(root.get("status"), JobStatus.DRAFT));
            if (request.status() != null) {
                predicates.add(builder.equal(root.get("status"), request.status()));
            }
            if (request.companyId() != null) {
                predicates.add(builder.equal(root.get("companyId"), request.companyId()));
            }
            if (hasText(request.q())) {
                String pattern = SpecificationSupport.containsPattern(request.q());
                predicates.add(
                        builder.or(
                                builder.like(builder.lower(root.get("title")), pattern),
                                builder.like(builder.lower(root.get("companyName")), pattern)));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

    public static Specification<Job> publicListing(
            SearchJobsRequest request, LocalDate today, Instant now) {
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
            if (request.companyId() != null) {
                predicates.add(builder.equal(root.get("companyId"), request.companyId()));
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
                Subquery<Long> skillMatch = query.subquery(Long.class);
                Root<Job> subJob = skillMatch.correlate(root);
                Join<Job, Skill> skills = subJob.join("skills");
                skillMatch.select(subJob.get("id")).where(skills.get("id").in(request.skillIds()));
                predicates.add(builder.exists(skillMatch));
            }
            if (query != null
                    && query.getResultType() != Long.class
                    && query.getResultType() != long.class) {
                Expression<Integer> activeBoost =
                        builder.<Integer>selectCase()
                                .when(
                                        builder.and(
                                                builder.greaterThan(root.get("boostLevel"), 0),
                                                builder.or(
                                                        builder.isNull(root.get("boostExpiresAt")),
                                                        builder.greaterThan(
                                                                root.get("boostExpiresAt"), now))),
                                        root.get("boostLevel"))
                                .otherwise(0);
                Expression<Instant> effectiveRecency =
                        builder.coalesce(
                                root.<Instant>get("retoppedAt"), root.<Instant>get("publishedAt"));
                query.orderBy(
                        builder.desc(activeBoost),
                        builder.desc(effectiveRecency),
                        builder.desc(root.get("id")));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
