package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.modules.candidate.entities.CandidatePreferredLocation;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.enums.CareerLevel;
import com.techx.intervue.modules.candidate.repositories.CandidatePreferredLocationRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.resources.CandidateExperienceResource;
import com.techx.intervue.modules.candidate.resources.CandidateProfileSectionsResource;
import com.techx.intervue.modules.candidate.resources.CandidateSkillResource;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileSectionsLoader;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.mappers.JobMapper;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.resources.JobRecommendationItemResource;
import com.techx.intervue.modules.job.resources.JobRecommendationResponse;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.services.interfaces.JobRecommendationServiceInterface;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobRecommendationService implements JobRecommendationServiceInterface {

    private static final int DEFAULT_LIMIT = 6;
    private static final int MAX_LIMIT = 20;
    private static final int CANDIDATE_POOL_LIMIT = 100;
    private static final Set<String> STOP_WORDS =
            Set.of(
                    "developer",
                    "engineer",
                    "chuyen",
                    "vien",
                    "lap",
                    "trinh",
                    "senior",
                    "junior",
                    "intern",
                    "staff");

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final CompanyServiceInterface companyService;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateProfileSectionsLoader sectionsLoader;
    private final CandidatePreferredLocationRepository locationRepository;

    @Override
    @Transactional(readOnly = true)
    public JobRecommendationResponse getRecommendations(Long candidateUserId, int limit) {
        int safeLimit = Math.min(Math.max(limit > 0 ? limit : DEFAULT_LIMIT, 1), MAX_LIMIT);
        LocalDate today = JobDeadlines.today();

        if (candidateUserId == null) {
            return buildFallbackResponse(
                    "GUEST",
                    "Sign in and complete your profile to receive personalized AI job suggestions.",
                    "/login",
                    safeLimit,
                    today);
        }

        CandidateProfile profile =
                candidateProfileRepository.findByUserId(candidateUserId).orElse(null);
        if (profile == null) {
            return buildFallbackResponse(
                    "EMPTY_PROFILE",
                    "Complete your profile (desired role, skills, experience) to receive tailored AI job recommendations.",
                    "/candidate/profile",
                    safeLimit,
                    today);
        }

        CandidateProfileSectionsResource sections = sectionsLoader.load(profile.getId());
        List<CandidatePreferredLocation> preferredLocations =
                locationRepository.findByCandidateProfileIdOrderByCityAsc(profile.getId());

        Set<String> candidateSkills = extractCandidateSkills(sections);
        String desiredRole =
                profile.getDesiredRole() != null ? profile.getDesiredRole().trim() : "";
        Set<String> preferredCities =
                preferredLocations.stream()
                        .map(CandidatePreferredLocation::getCity)
                        .filter(Objects::nonNull)
                        .map(this::normalize)
                        .collect(Collectors.toSet());

        boolean isProfileEmpty =
                desiredRole.isBlank() && candidateSkills.isEmpty() && preferredCities.isEmpty();

        if (isProfileEmpty) {
            return buildFallbackResponse(
                    "EMPTY_PROFILE",
                    "Complete your profile (desired role, skills, experience) to receive tailored AI job recommendations.",
                    "/candidate/profile",
                    safeLimit,
                    today);
        }

        List<Job> activeJobs =
                jobRepository.findActiveWithSkills(
                        JobStatus.PUBLISHED, today, PageRequest.of(0, CANDIDATE_POOL_LIMIT));

        if (activeJobs.isEmpty()) {
            return JobRecommendationResponse.builder()
                    .items(List.of())
                    .fallback(true)
                    .fallbackReason("NO_JOBS")
                    .nudgeMessage("Currently there are no open positions matching your criteria.")
                    .nudgeActionUrl("/jobs")
                    .build();
        }

        Map<Long, String> logos = logosOf(activeJobs);
        List<ScoredJob> scoredJobs = new ArrayList<>();

        for (Job job : activeJobs) {
            ScoredJob scored =
                    scoreJob(
                            job,
                            candidateSkills,
                            desiredRole,
                            preferredCities,
                            profile.getDesiredLevel(),
                            logos);
            if (scored.score() > 0.0) {
                scoredJobs.add(scored);
            }
        }

        if (scoredJobs.isEmpty()) {
            return buildFallbackResponse(
                    "NO_MATCH",
                    "No exact matches found for your current profile. Update your skills or preferences to get better suggestions.",
                    "/candidate/profile",
                    safeLimit,
                    today);
        }

        scoredJobs.sort(
                Comparator.comparingDouble(ScoredJob::score)
                        .reversed()
                        .thenComparing(
                                (ScoredJob s) ->
                                        s.job().getPublishedAt() != null
                                                ? s.job().getPublishedAt()
                                                : s.job().getCreatedAt(),
                                Comparator.nullsLast(Comparator.reverseOrder())));

        List<JobRecommendationItemResource> items =
                scoredJobs.stream()
                        .limit(safeLimit)
                        .map(
                                s ->
                                        JobRecommendationItemResource.builder()
                                                .job(s.summary())
                                                .matchReason(s.reason())
                                                .matchScore(Math.round(s.score() * 10.0) / 10.0)
                                                .matchedSkills(s.matchedSkills())
                                                .build())
                        .toList();

        return JobRecommendationResponse.builder()
                .items(items)
                .fallback(false)
                .fallbackReason(null)
                .nudgeMessage(null)
                .nudgeActionUrl(null)
                .build();
    }

    private JobRecommendationResponse buildFallbackResponse(
            String reason, String nudgeMessage, String nudgeUrl, int limit, LocalDate today) {
        List<Job> newestJobs =
                jobRepository.findActiveWithSkills(
                        JobStatus.PUBLISHED, today, PageRequest.of(0, limit));
        Map<Long, String> logos = logosOf(newestJobs);

        List<JobRecommendationItemResource> items =
                newestJobs.stream()
                        .map(
                                job ->
                                        JobRecommendationItemResource.builder()
                                                .job(
                                                        jobMapper.toPublicSummary(
                                                                job,
                                                                logos.get(job.getRecruiterId())))
                                                .matchReason("Newest opportunity on InterVue")
                                                .matchScore(0.0)
                                                .matchedSkills(List.of())
                                                .build())
                        .toList();

        return JobRecommendationResponse.builder()
                .items(items)
                .fallback(true)
                .fallbackReason(reason)
                .nudgeMessage(nudgeMessage)
                .nudgeActionUrl(nudgeUrl)
                .build();
    }

    private ScoredJob scoreJob(
            Job job,
            Set<String> candidateSkills,
            String desiredRole,
            Set<String> preferredCities,
            CareerLevel desiredLevel,
            Map<Long, String> logos) {
        List<String> matchedSkillNames = new ArrayList<>();
        Set<Skill> jobSkills = job.getSkills() != null ? job.getSkills() : Collections.emptySet();

        for (Skill s : jobSkills) {
            if (s.getName() != null && candidateSkills.contains(normalize(s.getName()))) {
                matchedSkillNames.add(s.getName());
            }
        }

        double skillScore = 0.0;
        int jobSkillsCount = jobSkills.size();
        if (jobSkillsCount > 0) {
            skillScore = ((double) matchedSkillNames.size() / jobSkillsCount) * 55.0;
        } else if (!matchedSkillNames.isEmpty()) {
            skillScore = 25.0;
        }

        boolean roleMatches = false;
        double roleScore = 0.0;
        if (!desiredRole.isBlank() && job.getTitle() != null) {
            String normRole = normalize(desiredRole);
            String normTitle = normalize(job.getTitle());
            if (normTitle.contains(normRole)
                    || normRole.contains(normTitle)
                    || hasWordOverlap(normRole, normTitle)) {
                roleMatches = true;
                roleScore = 25.0;
            }
        }

        boolean locationMatches = false;
        double locationScore = 0.0;
        if (job.getCity() != null && !preferredCities.isEmpty()) {
            String normCity = normalize(job.getCity());
            for (String city : preferredCities) {
                if (normCity.contains(city) || city.contains(normCity)) {
                    locationMatches = true;
                    locationScore = 12.0;
                    break;
                }
            }
        }

        boolean levelMatches = false;
        double levelScore = 0.0;
        if (desiredLevel != null && job.getLevel() != null) {
            if (job.getLevel().name().equalsIgnoreCase(desiredLevel.name())) {
                levelMatches = true;
                levelScore = 8.0;
            }
        }

        double totalScore = skillScore + roleScore + locationScore + levelScore;
        String reason =
                generateReason(
                        matchedSkillNames,
                        jobSkillsCount,
                        roleMatches,
                        desiredRole,
                        locationMatches,
                        job.getCity(),
                        levelMatches);

        PublicJobSummaryResource summary =
                jobMapper.toPublicSummary(job, logos.get(job.getRecruiterId()));
        return new ScoredJob(job, summary, totalScore, reason, matchedSkillNames);
    }

    private String generateReason(
            List<String> matchedSkills,
            int totalJobSkills,
            boolean roleMatches,
            String desiredRole,
            boolean locationMatches,
            String city,
            boolean levelMatches) {
        if (!matchedSkills.isEmpty()) {
            String skillsStr = String.join(", ", matchedSkills);
            if (totalJobSkills > 0 && matchedSkills.size() == totalJobSkills) {
                if (roleMatches) {
                    return "Matches all "
                            + matchedSkills.size()
                            + " required skills ("
                            + skillsStr
                            + ") & target role";
                }
                return "Matches all " + matchedSkills.size() + " required skills: " + skillsStr;
            }
            if (roleMatches) {
                return "Matches "
                        + matchedSkills.size()
                        + "/"
                        + totalJobSkills
                        + " required skills ("
                        + skillsStr
                        + ") & target role";
            }
            return "Matches "
                    + matchedSkills.size()
                    + "/"
                    + totalJobSkills
                    + " required skills: "
                    + skillsStr;
        }

        if (roleMatches && locationMatches && city != null) {
            return "Matches desired role '" + desiredRole + "' in " + city;
        }
        if (roleMatches) {
            return "Matches your target position: " + desiredRole;
        }
        if (locationMatches && city != null) {
            return "Matches your preferred location in " + city;
        }
        if (levelMatches) {
            return "Matches your career experience level";
        }

        return "Recommended based on your profile preferences";
    }

    private boolean hasWordOverlap(String a, String b) {
        Set<String> wordsA = new HashSet<>(Arrays.asList(a.split("\\s+")));
        Set<String> wordsB = new HashSet<>(Arrays.asList(b.split("\\s+")));
        wordsA.removeIf(w -> w.length() <= 2 || isStopWord(w));
        wordsB.removeIf(w -> w.length() <= 2 || isStopWord(w));
        wordsA.retainAll(wordsB);
        return !wordsA.isEmpty();
    }

    private boolean isStopWord(String word) {
        return STOP_WORDS.contains(word);
    }

    private Set<String> extractCandidateSkills(CandidateProfileSectionsResource sections) {
        Set<String> skills = new HashSet<>();
        if (sections.skills() != null) {
            for (CandidateSkillResource s : sections.skills()) {
                if (s.name() != null) {
                    skills.add(normalize(s.name()));
                }
            }
        }
        if (sections.experiences() != null) {
            for (CandidateExperienceResource exp : sections.experiences()) {
                if (exp.skills() != null) {
                    for (String s : exp.skills()) {
                        if (s != null) {
                            skills.add(normalize(s));
                        }
                    }
                }
            }
        }
        return skills;
    }

    private String normalize(String str) {
        if (str == null) return "";
        return str.trim().toLowerCase(Locale.ROOT);
    }

    private Map<Long, String> logosOf(List<Job> jobs) {
        Set<Long> recruiterIds = jobs.stream().map(Job::getRecruiterId).collect(Collectors.toSet());
        return companyService.findLogoUrlsByRecruiterIds(recruiterIds);
    }

    private record ScoredJob(
            Job job,
            PublicJobSummaryResource summary,
            double score,
            String reason,
            List<String> matchedSkills) {}
}
