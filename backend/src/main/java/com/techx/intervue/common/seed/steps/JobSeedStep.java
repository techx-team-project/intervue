package com.techx.intervue.common.seed.steps;

import com.techx.intervue.common.seed.DemoSeedData;
import com.techx.intervue.common.seed.DemoSeedData.City;
import com.techx.intervue.common.seed.DemoSeedData.JobSpec;
import com.techx.intervue.common.seed.DemoSeedData.ScreeningQuestion;
import com.techx.intervue.common.seed.DemoSeedStep;
import com.techx.intervue.common.seed.IdSequence;
import com.techx.intervue.common.seed.SeedDatabase;
import com.techx.intervue.common.seed.SeedLookups;
import com.techx.intervue.common.seed.SeedLookups.SeedRecruiter;
import com.techx.intervue.common.seed.SeedLookups.SeedSkill;
import com.techx.intervue.common.seed.SeedRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("local")
@Order(4)
@RequiredArgsConstructor
public class JobSeedStep implements DemoSeedStep {

    private static final List<String> JOB_COLUMNS =
            List.of(
                    "id",
                    "recruiter_id",
                    "company_id",
                    "company_name",
                    "title",
                    "status",
                    "level",
                    "contract_type",
                    "working_arrangement",
                    "city",
                    "address",
                    "latitude",
                    "longitude",
                    "salary_negotiable",
                    "salary_min",
                    "salary_max",
                    "salary_currency",
                    "description",
                    "requirements",
                    "benefits",
                    "application_mode",
                    "openings",
                    "deadline",
                    "published_at",
                    "hidden_reason",
                    "hidden_at",
                    "hidden_by",
                    "created_at",
                    "updated_at",
                    "job_role",
                    "experience_min_years",
                    "experience_max_years",
                    "salary_basis",
                    "benefit_tags",
                    "hiring_steps",
                    "boost_level",
                    "boost_expires_at",
                    "highlight_label",
                    "highlight_label_expires_at",
                    "highlighted",
                    "highlight_expires_at",
                    "approved_at");

    private static final List<String> QUESTION_COLUMNS =
            List.of(
                    "id",
                    "job_id",
                    "position",
                    "question_type",
                    "prompt",
                    "required",
                    "options",
                    "created_at",
                    "updated_at");

    private static final List<String> BENEFIT_TAGS =
            List.of(
                    "HEALTH_INSURANCE",
                    "BONUS_13TH_MONTH",
                    "PERFORMANCE_BONUS",
                    "LAPTOP",
                    "TRAINING",
                    "TEAM_BUILDING",
                    "FLEXIBLE_HOURS",
                    "REMOTE_DAYS",
                    "ANNUAL_LEAVE",
                    "MEALS");

    private static final int BENEFIT_TAG_COUNT = 5;

    private static final List<String> HIRING_STEPS =
            List.of("CV screening", "Technical interview", "HR interview", "Offer");

    private static final List<String> WORKING_ARRANGEMENTS =
            List.of("ON_SITE", "HYBRID", "HYBRID", "REMOTE", "FLEXIBLE");

    private final SeedDatabase database;
    private final SeedLookups lookups;

    @Override
    public void seed() {
        if (!database.allEmpty("jobs")) {
            return;
        }
        SeedRandom random = new SeedRandom(DemoSeedData.RANDOM_SEED + 4);
        List<SeedRecruiter> recruiters = lookups.showcaseRecruiters();
        Map<String, SeedSkill> skills = lookups.skillsByName();
        long adminId = lookups.firstAdminId();

        IdSequence jobIds = database.sequence("jobs");
        IdSequence questionIds = database.sequence("job_screening_questions");
        List<Object[]> jobs = new ArrayList<>();
        List<Object[]> jobSkills = new ArrayList<>();
        List<Object[]> questions = new ArrayList<>();

        for (int index = 0; index < DemoSeedData.JOB_COUNT; index++) {
            JobSpec spec = DemoSeedData.JOB_SPECS.get(index % DemoSeedData.JOB_SPECS.size());
            SeedRecruiter recruiter = recruiters.get(index % recruiters.size());
            String status = random.pickWeighted(DemoSeedData.JOB_STATUS_WEIGHTS);
            String title = spec.title() + random.pick(DemoSeedData.TITLE_TAGS);
            long jobId = jobIds.next();
            LocalDateTime createdAt = random.ago(2, 60);
            Set<String> skillNames =
                    spec.skills().stream()
                            .filter(skills::containsKey)
                            .collect(Collectors.toCollection(LinkedHashSet::new));
            boolean withQuestions = index % 3 == 0;

            jobs.add(
                    jobRow(
                            jobId,
                            index,
                            title,
                            status,
                            spec,
                            recruiter,
                            skillNames,
                            withQuestions,
                            adminId,
                            createdAt,
                            random));
            skillNames.forEach(name -> jobSkills.add(new Object[] {jobId, skills.get(name).id()}));
            if (withQuestions) {
                List<ScreeningQuestion> set =
                        DemoSeedData.QUESTION_SETS.get(index % DemoSeedData.QUESTION_SETS.size());
                for (int position = 0; position < set.size(); position++) {
                    questions.add(
                            questionRow(
                                    questionIds.next(),
                                    jobId,
                                    position + 1,
                                    set.get(position),
                                    createdAt));
                }
            }
        }

        database.insert("jobs", JOB_COLUMNS, jobs);
        database.insert("job_skills", List.of("job_id", "skill_id"), jobSkills);
        database.insert("job_screening_questions", QUESTION_COLUMNS, questions);
        log.info("Seeded {} jobs", jobs.size());
    }

    private Object[] jobRow(
            long jobId,
            int index,
            String title,
            String status,
            JobSpec spec,
            SeedRecruiter recruiter,
            Set<String> skillNames,
            boolean withQuestions,
            long adminId,
            LocalDateTime createdAt,
            SeedRandom random) {
        City city = cityFor(index, recruiter.city(), random);
        boolean hidden = "HIDDEN_BY_ADMIN".equals(status);
        boolean negotiable = index % 9 == 0;
        boolean usd =
                index % 13 == 0 && ("SENIOR".equals(spec.level()) || "LEAD".equals(spec.level()));
        long baseSalary = baseSalary(spec.level());
        boolean closedOrExpired = "EXPIRED".equals(status) || "CLOSED".equals(status);
        Promotion promotion = promotionFor(index, status);
        LocalDateTime promotionEnd = random.now().plusDays(random.between(7, 30));
        LocalDate deadline =
                closedOrExpired
                        ? random.now().toLocalDate().minusDays(random.between(1, 15))
                        : random.now().toLocalDate().plusDays(random.between(10, 60));
        return new Object[] {
            jobId,
            recruiter.id(),
            recruiter.companyId(),
            recruiter.companyName(),
            title,
            status,
            spec.level(),
            contractType(spec),
            random.pick(WORKING_ARRANGEMENTS),
            city.name(),
            random.between(10, 300) + " " + random.pick(DemoSeedData.STREETS) + ", " + city.name(),
            Math.round((city.latitude() + random.between(-0.04, 0.04)) * 1_000_000) / 1_000_000.0,
            Math.round((city.longitude() + random.between(-0.04, 0.04)) * 1_000_000) / 1_000_000.0,
            negotiable,
            negotiable ? null : (usd ? 2000L : baseSalary),
            negotiable ? null : (usd ? 3500L : (long) (baseSalary * 1.5)),
            negotiable ? null : (usd ? "USD" : "VND"),
            description(title, spec, recruiter, city, random),
            requirements(spec, skillNames),
            random.pick(DemoSeedData.BENEFIT_PACKAGES),
            withQuestions ? "CV_AND_QUESTIONS" : "CV_ONLY",
            random.between(1, 5),
            deadline,
            "DRAFT".equals(status) ? null : createdAt,
            hidden ? "The job post does not meet our content policy" : null,
            hidden ? random.now().minusDays(1) : null,
            hidden ? adminId : null,
            createdAt,
            createdAt,
            spec.role(),
            experienceMinYears(spec.level()),
            experienceMaxYears(spec.level()),
            negotiable ? null : (index % 4 == 0 ? "NET" : "GROSS"),
            jsonArray(benefitTags(index)),
            jsonArray(HIRING_STEPS),
            promotion.boostLevel(),
            promotion.boostLevel() > 0 ? promotionEnd : null,
            promotion.label(),
            promotion.label() == null ? null : promotionEnd,
            promotion.highlighted(),
            promotion.highlighted() ? promotionEnd : null,
            "DRAFT".equals(status) ? null : createdAt
        };
    }

    private record Promotion(int boostLevel, String label, boolean highlighted) {}

    private Promotion promotionFor(int index, String status) {
        if (!"PUBLISHED".equals(status)) {
            return new Promotion(0, null, false);
        }
        String label = index % 10 == 0 ? "HOT" : index % 14 == 0 ? "URGENT" : null;
        int boost = index % 21 == 0 ? 2 : index % 7 == 0 ? 1 : 0;
        return new Promotion(boost, label, index % 12 == 0);
    }

    private String description(
            String title, JobSpec spec, SeedRecruiter recruiter, City city, SeedRandom random) {
        List<String> duties = DemoSeedData.ROLE_RESPONSIBILITIES.get(spec.role());
        return recruiter.companyName()
                + " is hiring a "
                + title
                + " to join our engineering team in "
                + city.name()
                + ".\n\nWhat you will do\n"
                + random.sample(duties, 4).stream()
                        .map(duty -> "- " + duty)
                        .collect(Collectors.joining("\n"))
                + "\n\nYou will work with an experienced team that values clean code, ownership"
                + " and continuous learning.";
    }

    private String requirements(JobSpec spec, Set<String> skillNames) {
        return "- "
                + experienceMinYears(spec.level())
                + "+ years of relevant experience\n"
                + skillNames.stream()
                        .map(name -> "- Hands-on experience with " + name)
                        .collect(Collectors.joining("\n"))
                + "\n- Strong problem-solving skills and clear communication"
                + "\n- Comfortable reading and writing technical English";
    }

    private City cityFor(int index, String recruiterCity, SeedRandom random) {
        if (index % 11 == 0) {
            return random.pick(DemoSeedData.CITIES);
        }
        return DemoSeedData.CITIES.stream()
                .filter(city -> city.name().equals(recruiterCity))
                .findFirst()
                .orElse(DemoSeedData.CITIES.getFirst());
    }

    private String contractType(JobSpec spec) {
        if ("INTERN".equals(spec.level())) {
            return "INTERNSHIP";
        }
        return spec.title().contains("Part-time") ? "PART_TIME" : "FULL_TIME";
    }

    private int experienceMinYears(String level) {
        return switch (level) {
            case "INTERN", "JUNIOR" -> 0;
            case "MID" -> 2;
            case "SENIOR" -> 4;
            default -> 6;
        };
    }

    private int experienceMaxYears(String level) {
        return switch (level) {
            case "INTERN" -> 1;
            case "JUNIOR" -> 2;
            case "MID" -> 4;
            case "SENIOR" -> 8;
            default -> 12;
        };
    }

    private List<String> benefitTags(int index) {
        int start = index % BENEFIT_TAGS.size();
        return IntStream.range(0, BENEFIT_TAG_COUNT)
                .mapToObj(offset -> BENEFIT_TAGS.get((start + offset) % BENEFIT_TAGS.size()))
                .toList();
    }

    private String jsonArray(List<String> values) {
        return values.stream()
                .map(value -> "\"" + value + "\"")
                .collect(Collectors.joining(",", "[", "]"));
    }

    private long baseSalary(String level) {
        return switch (level) {
            case "INTERN" -> 5_000_000L;
            case "JUNIOR" -> 12_000_000L;
            case "MID" -> 22_000_000L;
            case "SENIOR" -> 40_000_000L;
            default -> 65_000_000L;
        };
    }

    private Object[] questionRow(
            long id,
            long jobId,
            int position,
            ScreeningQuestion question,
            LocalDateTime createdAt) {
        String options = question.options().isEmpty() ? null : jsonArray(question.options());
        return new Object[] {
            id,
            jobId,
            position,
            question.type(),
            question.prompt(),
            question.required(),
            options,
            createdAt,
            createdAt
        };
    }
}
