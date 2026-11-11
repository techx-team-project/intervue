package com.techx.intervue.modules.job.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.techx.intervue.modules.candidate.entities.CandidatePreferredLocation;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.enums.CareerLevel;
import com.techx.intervue.modules.candidate.repositories.CandidatePreferredLocationRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.resources.CandidateProfileSectionsResource;
import com.techx.intervue.modules.candidate.resources.CandidateSkillResource;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileSectionsLoader;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.mappers.JobMapper;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.resources.JobRecommendationResponse;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.services.impl.JobRecommendationService;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;

class JobRecommendationServiceTest {

    private JobRepository jobRepository;
    private JobMapper jobMapper;
    private CompanyServiceInterface companyService;
    private CandidateProfileRepository candidateProfileRepository;
    private CandidateProfileSectionsLoader sectionsLoader;
    private CandidatePreferredLocationRepository locationRepository;

    private JobRecommendationService service;

    @BeforeEach
    void setUp() {
        jobRepository = mock(JobRepository.class);
        jobMapper = mock(JobMapper.class);
        companyService = mock(CompanyServiceInterface.class);
        candidateProfileRepository = mock(CandidateProfileRepository.class);
        sectionsLoader = mock(CandidateProfileSectionsLoader.class);
        locationRepository = mock(CandidatePreferredLocationRepository.class);

        service =
                new JobRecommendationService(
                        jobRepository,
                        jobMapper,
                        companyService,
                        candidateProfileRepository,
                        sectionsLoader,
                        locationRepository);
    }

    @Test
    void getRecommendations_unauthenticated_returnsFallbackWithGuestNudge() {
        Job job = Job.builder().id(1L).title("Java Dev").recruiterId(10L).build();
        PublicJobSummaryResource summary =
                PublicJobSummaryResource.builder().id(1L).title("Java Dev").build();

        when(jobRepository.findActiveWithSkills(
                        eq(JobStatus.PUBLISHED), any(LocalDate.class), any(Pageable.class)))
                .thenReturn(List.of(job));
        when(companyService.findLogoUrlsByRecruiterIds(any())).thenReturn(Map.of());
        when(jobMapper.toPublicSummary(eq(job), any())).thenReturn(summary);

        JobRecommendationResponse response = service.getRecommendations(null, 5);

        assertThat(response.fallback()).isTrue();
        assertThat(response.fallbackReason()).isEqualTo("GUEST");
        assertThat(response.nudgeMessage()).contains("Sign in");
        assertThat(response.nudgeActionUrl()).isEqualTo("/login");
        assertThat(response.items()).hasSize(1);
        assertThat(response.items().get(0).matchReason())
                .isEqualTo("Newest opportunity on InterVue");
    }

    @Test
    void getRecommendations_emptyProfile_returnsFallbackWithProfileNudge() {
        Long userId = 42L;
        CandidateProfile emptyProfile = CandidateProfile.builder().id(100L).userId(userId).build();

        when(candidateProfileRepository.findByUserId(userId)).thenReturn(Optional.of(emptyProfile));
        when(sectionsLoader.load(100L))
                .thenReturn(
                        new CandidateProfileSectionsResource(
                                List.of(), List.of(), List.of(), List.of(), List.of(), List.of()));
        when(locationRepository.findByCandidateProfileIdOrderByCityAsc(100L)).thenReturn(List.of());

        Job job = Job.builder().id(2L).title("Frontend React").recruiterId(11L).build();
        PublicJobSummaryResource summary =
                PublicJobSummaryResource.builder().id(2L).title("Frontend React").build();

        when(jobRepository.findActiveWithSkills(
                        eq(JobStatus.PUBLISHED), any(LocalDate.class), any(Pageable.class)))
                .thenReturn(List.of(job));
        when(companyService.findLogoUrlsByRecruiterIds(any())).thenReturn(Map.of());
        when(jobMapper.toPublicSummary(eq(job), any())).thenReturn(summary);

        JobRecommendationResponse response = service.getRecommendations(userId, 5);

        assertThat(response.fallback()).isTrue();
        assertThat(response.fallbackReason()).isEqualTo("EMPTY_PROFILE");
        assertThat(response.nudgeMessage()).contains("Complete your profile");
        assertThat(response.nudgeActionUrl()).isEqualTo("/candidate/profile");
        assertThat(response.items()).hasSize(1);
    }

    @Test
    void getRecommendations_profileWithSkillsAndDesiredRole_returnsPersonalizedRecommendations() {
        Long userId = 42L;
        CandidateProfile profile =
                CandidateProfile.builder()
                        .id(100L)
                        .userId(userId)
                        .desiredRole("Backend Developer")
                        .desiredLevel(CareerLevel.JUNIOR)
                        .build();

        CandidateSkillResource javaSkill = new CandidateSkillResource(1L, "Java", null, null, 2);
        CandidateSkillResource springSkill =
                new CandidateSkillResource(2L, "Spring Boot", null, null, 2);

        when(candidateProfileRepository.findByUserId(userId)).thenReturn(Optional.of(profile));
        when(sectionsLoader.load(100L))
                .thenReturn(
                        new CandidateProfileSectionsResource(
                                List.of(),
                                List.of(),
                                List.of(),
                                List.of(),
                                List.of(),
                                List.of(javaSkill, springSkill)));

        CandidatePreferredLocation loc =
                CandidatePreferredLocation.builder()
                        .candidateProfile(profile)
                        .city("Hà Nội")
                        .build();
        when(locationRepository.findByCandidateProfileIdOrderByCityAsc(100L))
                .thenReturn(List.of(loc));

        Skill s1 = Skill.builder().id(1L).name("Java").build();
        Skill s2 = Skill.builder().id(2L).name("Spring Boot").build();
        Skill s3 = Skill.builder().id(3L).name("Docker").build();

        Job matchingJob =
                Job.builder()
                        .id(10L)
                        .title("Senior Backend Developer")
                        .recruiterId(20L)
                        .city("Hà Nội")
                        .level(JobLevel.JUNIOR)
                        .skills(Set.of(s1, s2, s3))
                        .build();

        Job unmatchingJob =
                Job.builder()
                        .id(11L)
                        .title("UI/UX Designer")
                        .recruiterId(21L)
                        .city("Đà Nẵng")
                        .level(JobLevel.SENIOR)
                        .skills(Collections.emptySet())
                        .build();

        when(jobRepository.findActiveWithSkills(
                        eq(JobStatus.PUBLISHED), any(LocalDate.class), any(Pageable.class)))
                .thenReturn(List.of(matchingJob, unmatchingJob));
        when(companyService.findLogoUrlsByRecruiterIds(any())).thenReturn(Map.of());

        PublicJobSummaryResource summary1 =
                PublicJobSummaryResource.builder()
                        .id(10L)
                        .title("Senior Backend Developer")
                        .build();
        when(jobMapper.toPublicSummary(eq(matchingJob), any())).thenReturn(summary1);

        JobRecommendationResponse response = service.getRecommendations(userId, 5);

        assertThat(response.fallback()).isFalse();
        assertThat(response.nudgeMessage()).isNull();
        assertThat(response.items()).hasSize(1);

        var first = response.items().get(0);
        assertThat(first.job().id()).isEqualTo(10L);
        assertThat(first.matchScore()).isGreaterThan(0.0);
        assertThat(first.matchedSkills()).containsExactlyInAnyOrder("Java", "Spring Boot");
        assertThat(first.matchReason()).contains("2/3 required skills");
    }
}
