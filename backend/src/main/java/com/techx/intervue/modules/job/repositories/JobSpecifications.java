package com.techx.intervue.modules.job.repositories;

import com.techx.intervue.common.persistence.SpecificationSupport;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.enums.JobSort;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.enums.SalaryCurrency;
import com.techx.intervue.modules.job.requests.AdminSearchJobsRequest;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.requests.SearchRecruiterJobsRequest;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Order;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class JobSpecifications {

    private static final long USD_TO_VND = 25_000L;

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
            if (request.jobRole() != null) {
                predicates.add(builder.equal(root.get("jobRole"), request.jobRole()));
            }
            if (request.experienceYears() != null) {
                predicates.add(
                        builder.or(
                                builder.isNull(root.get("experienceMinYears")),
                                builder.lessThanOrEqualTo(
                                        root.get("experienceMinYears"),
                                        request.experienceYears())));
            }
            if (request.salaryFrom() != null) {
                SalaryCurrency currency =
                        request.currency() == null ? SalaryCurrency.VND : request.currency();
                predicates.add(builder.isFalse(root.get("salaryNegotiable")));
                predicates.add(builder.equal(root.get("salaryCurrency"), currency));
                predicates.add(
                        builder.greaterThanOrEqualTo(root.get("salaryMax"), request.salaryFrom()));
            }
            if (request.postedWithinDays() != null) {
                predicates.add(
                        builder.greaterThanOrEqualTo(
                                recency(root, builder),
                                now.minus(Duration.ofDays(request.postedWithinDays()))));
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
                query.orderBy(ordering(request.sort(), root, builder, now));
            }
            return builder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static Expression<Instant> recency(Root<Job> root, CriteriaBuilder builder) {
        return builder.coalesce(root.<Instant>get("retoppedAt"), root.<Instant>get("publishedAt"));
    }

    private static Expression<Integer> activeBoost(
            Root<Job> root, CriteriaBuilder builder, Instant now) {
        return builder.<Integer>selectCase()
                .when(
                        builder.and(
                                builder.greaterThan(root.get("boostLevel"), 0),
                                builder.or(
                                        builder.isNull(root.get("boostExpiresAt")),
                                        builder.greaterThan(root.get("boostExpiresAt"), now))),
                        root.get("boostLevel"))
                .otherwise(0);
    }

    // Salaries are stored in their own currency, so USD is converted at a fixed rate to compare
    private static Expression<Long> salaryInVnd(Root<Job> root, CriteriaBuilder builder) {
        return builder.<Long>selectCase()
                .when(
                        builder.equal(root.get("salaryCurrency"), SalaryCurrency.USD),
                        builder.prod(root.<Long>get("salaryMax"), USD_TO_VND))
                .otherwise(root.<Long>get("salaryMax"));
    }

    private static List<Order> ordering(
            JobSort sort, Root<Job> root, CriteriaBuilder builder, Instant now) {
        Order newestFirst = builder.desc(recency(root, builder));
        Order latestId = builder.desc(root.get("id"));
        return switch (sort == null ? JobSort.RECOMMENDED : sort) {
            case NEWEST -> List.of(newestFirst, latestId);
            case SALARY_DESC ->
                    List.of(builder.desc(salaryInVnd(root, builder)), newestFirst, latestId);
            case DEADLINE_ASC -> List.of(builder.asc(root.get("deadline")), newestFirst, latestId);
            case RECOMMENDED ->
                    List.of(builder.desc(activeBoost(root, builder, now)), newestFirst, latestId);
        };
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
