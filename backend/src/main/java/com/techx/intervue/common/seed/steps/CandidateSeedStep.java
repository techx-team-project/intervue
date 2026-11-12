package com.techx.intervue.common.seed.steps;

import com.techx.intervue.common.seed.DemoSeedData;
import com.techx.intervue.common.seed.DemoSeedData.CandidateRole;
import com.techx.intervue.common.seed.DemoSeedData.OwnerAccount;
import com.techx.intervue.common.seed.DemoSeedStep;
import com.techx.intervue.common.seed.IdSequence;
import com.techx.intervue.common.seed.SeedDatabase;
import com.techx.intervue.common.seed.SeedLookups;
import com.techx.intervue.common.seed.SeedLookups.SeedSkill;
import com.techx.intervue.common.seed.SeedLookups.SeedUser;
import com.techx.intervue.common.seed.SeedRandom;
import com.techx.intervue.common.seed.SeedText;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("local")
@Order(3)
@RequiredArgsConstructor
public class CandidateSeedStep implements DemoSeedStep {

    private static final List<String> PROFILE_COLUMNS =
            List.of(
                    "id",
                    "user_id",
                    "headline",
                    "bio",
                    "contact_email",
                    "gender",
                    "birth_year",
                    "show_personal_details",
                    "searchable_by_recruiters",
                    "job_search_status",
                    "github_url",
                    "desired_role",
                    "desired_level",
                    "total_yoe",
                    "salary_min",
                    "salary_max",
                    "currency",
                    "salary_period",
                    "salary_negotiable",
                    "created_at",
                    "updated_at");

    private static final List<String> SKILL_COLUMNS =
            List.of(
                    "id",
                    "candidate_profile_id",
                    "name",
                    "category",
                    "level",
                    "years",
                    "created_at",
                    "updated_at");

    private static final List<String> EXPERIENCE_COLUMNS =
            List.of(
                    "id",
                    "candidate_profile_id",
                    "title",
                    "company_name",
                    "location",
                    "start_date",
                    "end_date",
                    "is_current",
                    "description",
                    "achievements",
                    "created_at",
                    "updated_at");

    private static final List<String> EDUCATION_COLUMNS =
            List.of(
                    "id",
                    "candidate_profile_id",
                    "school",
                    "degree",
                    "major",
                    "start_year",
                    "end_year",
                    "gpa",
                    "created_at",
                    "updated_at");

    private static final List<String> RESUME_COLUMNS =
            List.of(
                    "id",
                    "candidate_profile_id",
                    "file_name",
                    "storage_public_id",
                    "file_size_bytes",
                    "content_type",
                    "is_default",
                    "created_at",
                    "updated_at");

    private static final List<String> IDENTITY_COLUMNS =
            List.of(
                    "id",
                    "user_id",
                    "status",
                    "full_name",
                    "date_of_birth",
                    "id_number_hash",
                    "id_number_last4",
                    "front_public_id",
                    "back_public_id",
                    "selfie_public_id",
                    "submitted_at",
                    "reviewed_at",
                    "reviewed_by",
                    "reject_reason",
                    "rejection_count",
                    "attempt_limit",
                    "manual_review_requested_at",
                    "created_at",
                    "updated_at");

    private static final Map<String, String> SKILL_CATEGORIES =
            Map.of(
                    "CORE", "CORE",
                    "AI_DATA", "AI_DATA",
                    "TOOLS_DEVOPS", "TOOLS_DEVOPS",
                    "SOFT_SKILLS", "SOFT");

    private static final int ATTEMPT_LIMIT = 5;

    private final SeedDatabase database;
    private final SeedLookups lookups;

    @Override
    public void seed() {
        if (!database.allEmpty("candidate_profiles", "identity_verifications")) {
            return;
        }
        SeedRandom random = new SeedRandom(DemoSeedData.RANDOM_SEED + 3);
        List<SeedUser> candidates = lookups.usersWithRole("CANDIDATE");
        Map<String, SeedSkill> skills = lookups.skillsByName();
        long adminId = lookups.firstAdminId();
        Set<String> ownerEmails =
                DemoSeedData.OWNERS.stream().map(OwnerAccount::email).collect(Collectors.toSet());

        IdSequence profileIds = database.sequence("candidate_profiles");
        IdSequence skillIds = database.sequence("candidate_skills");
        IdSequence experienceIds = database.sequence("candidate_experiences");
        IdSequence educationIds = database.sequence("candidate_educations");
        IdSequence resumeIds = database.sequence("candidate_resumes");
        IdSequence identityIds = database.sequence("identity_verifications");

        List<Object[]> profiles = new ArrayList<>();
        List<Object[]> skillRows = new ArrayList<>();
        List<Object[]> experiences = new ArrayList<>();
        List<Object[]> educations = new ArrayList<>();
        List<Object[]> resumes = new ArrayList<>();
        List<Object[]> identities = new ArrayList<>();

        for (int index = 0; index < candidates.size(); index++) {
            SeedUser candidate = candidates.get(index);
            boolean owner = ownerEmails.contains(candidate.email());
            CandidateRole role =
                    DemoSeedData.CANDIDATE_ROLES.get(index % DemoSeedData.CANDIDATE_ROLES.size());
            String level = levelFor(index, owner);
            double yearsOfExperience = yearsOfExperience(level, random);
            long profileId = profileIds.next();
            LocalDateTime createdAt = candidate.createdAt().plusHours(1);

            profiles.add(
                    profileRow(
                            profileId,
                            candidate,
                            role,
                            level,
                            yearsOfExperience,
                            createdAt,
                            random));
            skillRows.addAll(skillRows(skillIds, profileId, role, skills, createdAt, random));
            experiences.addAll(
                    experienceRows(
                            experienceIds,
                            profileId,
                            role,
                            level,
                            yearsOfExperience,
                            createdAt,
                            random));
            educations.add(
                    new Object[] {
                        educationIds.next(),
                        profileId,
                        random.pick(DemoSeedData.SCHOOLS),
                        "Bachelor",
                        "Information Technology",
                        2016 + index % 5,
                        2020 + index % 5,
                        random.pick(List.of("3.2/4.0", "3.5/4.0", "8.1/10", "7.6/10")),
                        createdAt,
                        createdAt
                    });
            resumes.addAll(resumeRows(resumeIds, profileId, candidate, createdAt, random));
            identities.add(
                    identityRow(identityIds.next(), candidate, index, owner, adminId, random));
        }

        database.insert("candidate_profiles", PROFILE_COLUMNS, profiles);
        database.insert("candidate_skills", SKILL_COLUMNS, skillRows);
        database.insert("candidate_experiences", EXPERIENCE_COLUMNS, experiences);
        database.insert("candidate_educations", EDUCATION_COLUMNS, educations);
        database.insert("candidate_resumes", RESUME_COLUMNS, resumes);
        database.insert("identity_verifications", IDENTITY_COLUMNS, identities);
        log.info("Seeded {} candidate profiles", profiles.size());
    }

    private String levelFor(int index, boolean owner) {
        if (owner) {
            return DemoSeedData.OWNER_LEVELS.get(index % DemoSeedData.OWNER_LEVELS.size());
        }
        return DemoSeedData.LEVELS.get(index % DemoSeedData.LEVELS.size());
    }

    private double yearsOfExperience(String level, SeedRandom random) {
        return switch (level) {
            case "INTERN" -> 0.0;
            case "JUNIOR" -> random.pick(List.of(0.5, 1.0, 1.5));
            case "MID" -> random.pick(List.of(2.5, 3.0, 4.0));
            default -> random.pick(List.of(5.0, 6.5, 8.0));
        };
    }

    private long salaryFloor(String level) {
        return switch (level) {
            case "INTERN" -> 4_000_000L;
            case "JUNIOR" -> 10_000_000L;
            case "MID" -> 20_000_000L;
            default -> 35_000_000L;
        };
    }

    private Object[] profileRow(
            long profileId,
            SeedUser candidate,
            CandidateRole role,
            String level,
            double yearsOfExperience,
            LocalDateTime createdAt,
            SeedRandom random) {
        long salaryMin = salaryFloor(level);
        return new Object[] {
            profileId,
            candidate.id(),
            level.charAt(0) + level.substring(1).toLowerCase() + " " + role.title(),
            role.title()
                    + " with "
                    + yearsOfExperience
                    + " years of experience, enjoys building real products and learning new technologies.",
            candidate.email(),
            random.pick(List.of("MALE", "FEMALE")),
            random.between(1996, 2004),
            false,
            true,
            random.pick(DemoSeedData.SEARCH_STATUSES),
            "https://github.com/" + SeedText.compactSlug(candidate.name()),
            role.title(),
            level,
            yearsOfExperience,
            salaryMin,
            salaryMin + 10_000_000L,
            "VND",
            "MONTHLY",
            false,
            createdAt,
            createdAt
        };
    }

    private List<Object[]> skillRows(
            IdSequence ids,
            long profileId,
            CandidateRole role,
            Map<String, SeedSkill> skills,
            LocalDateTime createdAt,
            SeedRandom random) {
        Set<String> names = new LinkedHashSet<>();
        role.skills().stream().filter(skills::containsKey).forEach(names::add);
        random.sample(DemoSeedData.EXTRA_SKILLS.stream().filter(skills::containsKey).toList(), 2)
                .forEach(names::add);
        Map<String, Object[]> rows = new LinkedHashMap<>();
        for (String name : names) {
            rows.put(
                    name,
                    new Object[] {
                        ids.next(),
                        profileId,
                        name,
                        SKILL_CATEGORIES.getOrDefault(skills.get(name).group(), "CORE"),
                        random.pick(DemoSeedData.SKILL_LEVELS),
                        random.between(0, 6),
                        createdAt,
                        createdAt
                    });
        }
        return new ArrayList<>(rows.values());
    }

    private List<Object[]> experienceRows(
            IdSequence ids,
            long profileId,
            CandidateRole role,
            String level,
            double yearsOfExperience,
            LocalDateTime createdAt,
            SeedRandom random) {
        int count = "INTERN".equals(level) ? 0 : random.between(1, 2);
        int firstYear = random.now().getYear() - (int) yearsOfExperience - 2;
        List<Object[]> rows = new ArrayList<>();
        for (int index = 0; index < count; index++) {
            boolean current = index == count - 1;
            rows.add(
                    new Object[] {
                        ids.next(),
                        profileId,
                        role.title(),
                        random.pick(DemoSeedData.PAST_COMPANIES),
                        "TP. Hồ Chí Minh",
                        LocalDate.of(firstYear + index, random.between(1, 12), 1),
                        current ? null : LocalDate.of(firstYear + index + 1, 6, 1),
                        current,
                        "Built and maintained features, took part in code reviews and worked in"
                                + " Agile/Scrum teams.",
                        "Reduced API response time by 30% and delivered projects on schedule.",
                        createdAt,
                        createdAt
                    });
        }
        return rows;
    }

    private List<Object[]> resumeRows(
            IdSequence ids,
            long profileId,
            SeedUser candidate,
            LocalDateTime createdAt,
            SeedRandom random) {
        int count = random.between(1, 2);
        String baseName = SeedText.compactSlug(candidate.name());
        List<Object[]> rows = new ArrayList<>();
        for (int index = 0; index < count; index++) {
            long id = ids.next();
            rows.add(
                    new Object[] {
                        id,
                        profileId,
                        "CV_" + baseName + (index == 0 ? "" : "_v" + (index + 1)) + ".pdf",
                        "demo/resume/" + id,
                        random.between(120_000, 900_000),
                        "application/pdf",
                        index == 0,
                        createdAt,
                        createdAt
                    });
        }
        return rows;
    }

    private Object[] identityRow(
            long id,
            SeedUser candidate,
            int index,
            boolean owner,
            long adminId,
            SeedRandom random) {
        String status = identityStatus(owner, random);
        boolean pending = "PENDING".equals(status);
        boolean rejected = "REJECTED".equals(status);
        boolean exhausted = rejected && random.chance(0.4);
        String idNumber = "0" + String.format("%011d", 79_000_000_000L + index * 7_919L);
        LocalDateTime submittedAt = random.ago(1, 20);
        int rejectionCount = exhausted ? ATTEMPT_LIMIT : (rejected ? 1 : 0);
        return new Object[] {
            id,
            candidate.id(),
            status,
            candidate.name(),
            LocalDate.of(random.between(1996, 2004), random.between(1, 12), random.between(1, 28)),
            SeedText.sha256(idNumber),
            idNumber.substring(idNumber.length() - 4),
            "demo/identity/" + candidate.id() + "-front",
            "demo/identity/" + candidate.id() + "-back",
            "demo/identity/" + candidate.id() + "-selfie",
            submittedAt,
            pending ? null : submittedAt.plusHours(5),
            pending ? null : adminId,
            rejected ? random.pick(DemoSeedData.REJECT_REASONS) : null,
            rejectionCount,
            ATTEMPT_LIMIT,
            exhausted && random.chance(0.5) ? random.now().minusHours(3) : null,
            submittedAt,
            submittedAt
        };
    }

    private String identityStatus(boolean owner, SeedRandom random) {
        if (owner) {
            return "APPROVED";
        }
        double roll = random.between(0.0, 1.0);
        if (roll < 0.75) {
            return "APPROVED";
        }
        return roll < 0.87 ? "PENDING" : "REJECTED";
    }
}
