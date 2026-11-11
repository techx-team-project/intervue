package com.techx.intervue.modules.candidate.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.enums.CvUnreadableReason;
import com.techx.intervue.modules.candidate.enums.SkillCategory;
import com.techx.intervue.modules.candidate.enums.SkillLevel;
import com.techx.intervue.modules.candidate.mappers.CandidateCertificationMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateEducationMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateExperienceMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateLanguageMapper;
import com.techx.intervue.modules.candidate.mappers.CandidateSkillMapper;
import com.techx.intervue.modules.candidate.repositories.CandidateCertificationRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateEducationRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateExperienceRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateExperienceSkillRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateLanguageRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateSkillRepository;
import com.techx.intervue.modules.candidate.requests.ApplyCvParsedRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateSkillRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.resources.CandidateProfileSectionsResource;
import com.techx.intervue.modules.candidate.resources.CandidateSkillResource;
import com.techx.intervue.modules.candidate.resources.CvParseProfileResponse;
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.resources.ParsedProfileData;
import com.techx.intervue.modules.candidate.services.impl.CandidateCvProfileService;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileLookup;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileSectionsLoader;
import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

class CandidateCvProfileServiceTest {

    private CvTextExtractorServiceInterface cvTextExtractorService;
    private CvTextCleaner cvTextCleaner;
    private CandidateResumeServiceInterface resumeService;
    private AiGatewayServiceInterface aiGatewayService;
    private PromptServiceInterface promptService;
    private ObjectMapper objectMapper;

    private CandidateProfileLookup profileLookup;
    private CandidateProfileRepository profileRepository;
    private CandidateProfileSectionsLoader sectionsLoader;
    private CandidateProfileServiceInterface profileService;

    private CandidateSkillRepository skillRepository;
    private CandidateExperienceRepository experienceRepository;
    private CandidateExperienceSkillRepository experienceSkillRepository;
    private CandidateEducationRepository educationRepository;
    private CandidateCertificationRepository certificationRepository;
    private CandidateLanguageRepository languageRepository;

    private CandidateSkillMapper skillMapper;
    private CandidateExperienceMapper experienceMapper;
    private CandidateEducationMapper educationMapper;
    private CandidateCertificationMapper certificationMapper;
    private CandidateLanguageMapper languageMapper;

    private CandidateCvProfileService service;

    @BeforeEach
    void setUp() {
        cvTextExtractorService = mock(CvTextExtractorServiceInterface.class);
        cvTextCleaner = mock(CvTextCleaner.class);
        resumeService = mock(CandidateResumeServiceInterface.class);
        aiGatewayService = mock(AiGatewayServiceInterface.class);
        promptService = mock(PromptServiceInterface.class);
        objectMapper = new ObjectMapper();

        profileLookup = mock(CandidateProfileLookup.class);
        profileRepository = mock(CandidateProfileRepository.class);
        sectionsLoader = mock(CandidateProfileSectionsLoader.class);
        profileService = mock(CandidateProfileServiceInterface.class);

        skillRepository = mock(CandidateSkillRepository.class);
        experienceRepository = mock(CandidateExperienceRepository.class);
        experienceSkillRepository = mock(CandidateExperienceSkillRepository.class);
        educationRepository = mock(CandidateEducationRepository.class);
        certificationRepository = mock(CandidateCertificationRepository.class);
        languageRepository = mock(CandidateLanguageRepository.class);

        skillMapper = mock(CandidateSkillMapper.class);
        experienceMapper = mock(CandidateExperienceMapper.class);
        educationMapper = mock(CandidateEducationMapper.class);
        certificationMapper = mock(CandidateCertificationMapper.class);
        languageMapper = mock(CandidateLanguageMapper.class);

        service =
                new CandidateCvProfileService(
                        cvTextExtractorService,
                        cvTextCleaner,
                        resumeService,
                        aiGatewayService,
                        promptService,
                        objectMapper,
                        profileLookup,
                        profileRepository,
                        sectionsLoader,
                        profileService,
                        skillRepository,
                        experienceRepository,
                        experienceSkillRepository,
                        educationRepository,
                        certificationRepository,
                        languageRepository,
                        skillMapper,
                        experienceMapper,
                        educationMapper,
                        certificationMapper,
                        languageMapper);
    }

    @Test
    void parseCv_unreadableCv_returnsReadableFalseWithReason() {
        Long userId = 10L;
        CandidateProfile profile = CandidateProfile.builder().id(1L).userId(userId).build();
        when(profileLookup.findOrCreateForUpdate(userId)).thenReturn(profile);
        when(sectionsLoader.load(1L))
                .thenReturn(
                        new CandidateProfileSectionsResource(
                                List.of(), List.of(), List.of(), List.of(), List.of(), List.of()));

        MockMultipartFile file =
                new MockMultipartFile("file", "cv.pdf", "application/pdf", new byte[] {1, 2, 3});
        CvTextExtractionResult unreadableResult =
                CvTextExtractionResult.unreadable(
                        "hash", CvUnreadableReason.PASSWORD_PROTECTED, 0, false);
        when(cvTextExtractorService.extractText(any(byte[].class))).thenReturn(unreadableResult);

        CvParseProfileResponse response = service.parseCv(userId, file, null, "127.0.0.1");

        assertThat(response.readable()).isFalse();
        assertThat(response.unreadableReason()).isEqualTo(CvUnreadableReason.PASSWORD_PROTECTED);
        assertThat(response.reasonMessage()).contains("mật khẩu");
        assertThat(response.parsedData()).isNull();
    }

    @Test
    void parseCv_emptyProfile_returnsProfileEmptyTrueWithParsedData() {
        Long userId = 10L;
        CandidateProfile emptyProfile = CandidateProfile.builder().id(1L).userId(userId).build();
        when(profileLookup.findOrCreateForUpdate(userId)).thenReturn(emptyProfile);
        when(sectionsLoader.load(1L))
                .thenReturn(
                        new CandidateProfileSectionsResource(
                                List.of(), List.of(), List.of(), List.of(), List.of(), List.of()));

        MockMultipartFile file =
                new MockMultipartFile("file", "cv.pdf", "application/pdf", new byte[] {1, 2, 3});
        CvTextExtractionResult okResult =
                CvTextExtractionResult.readable("hash", "Candidate CV content text", 1, false);
        when(cvTextExtractorService.extractText(any(byte[].class))).thenReturn(okResult);
        when(cvTextCleaner.clean(any())).thenReturn("Candidate CV content text");

        when(promptService.load("cv-to-profile", 1))
                .thenReturn(new PromptTemplate("cv-to-profile.v1", 1, "system prompt"));

        String aiJson =
                """
                {
                  "headline": "Senior Java Engineer",
                  "desiredRole": "Backend Developer",
                  "bio": "5 years experience in building distributed systems.",
                  "skills": [
                    { "name": "Java", "category": "CORE", "level": "PROFICIENT", "years": 5 }
                  ]
                }
                """;
        when(aiGatewayService.chat(any(), any()))
                .thenReturn(
                        new AiChatResult(aiJson, List.of(), null, null, "gemini-2.5-flash", null));

        CvParseProfileResponse response = service.parseCv(userId, file, null, "127.0.0.1");

        assertThat(response.readable()).isTrue();
        assertThat(response.profileEmpty()).isTrue();
        assertThat(response.parsedData()).isNotNull();
        assertThat(response.parsedData().headline()).isEqualTo("Senior Java Engineer");
        assertThat(response.parsedData().desiredRole()).isEqualTo("Backend Developer");
        assertThat(response.parsedData().skills()).hasSize(1);
    }

    @Test
    void parseCv_existingProfile_returnsProfileEmptyFalseWithDiffs() {
        Long userId = 10L;
        CandidateProfile existingProfile =
                CandidateProfile.builder()
                        .id(1L)
                        .userId(userId)
                        .headline("Junior Web Developer")
                        .desiredRole("Frontend Developer")
                        .bio("Old bio content")
                        .build();

        CandidateSkillResource oldSkill =
                new CandidateSkillResource(1L, "HTML", SkillCategory.CORE, SkillLevel.BASIC, 1);
        when(profileLookup.findOrCreateForUpdate(userId)).thenReturn(existingProfile);
        when(sectionsLoader.load(1L))
                .thenReturn(
                        new CandidateProfileSectionsResource(
                                List.of(),
                                List.of(),
                                List.of(),
                                List.of(),
                                List.of(),
                                List.of(oldSkill)));

        MockMultipartFile file =
                new MockMultipartFile("file", "cv.pdf", "application/pdf", new byte[] {1, 2, 3});
        CvTextExtractionResult okResult =
                CvTextExtractionResult.readable("hash", "Candidate CV content text", 1, false);
        when(cvTextExtractorService.extractText(any(byte[].class))).thenReturn(okResult);
        when(cvTextCleaner.clean(any())).thenReturn("Candidate CV content text");

        when(promptService.load("cv-to-profile", 1))
                .thenReturn(new PromptTemplate("cv-to-profile.v1", 1, "system prompt"));

        String aiJson =
                """
                {
                  "headline": "Fullstack Developer",
                  "desiredRole": "Fullstack Engineer",
                  "bio": "New bio content from CV",
                  "skills": [
                    { "name": "React", "category": "CORE", "level": "PROFICIENT", "years": 3 }
                  ]
                }
                """;
        when(aiGatewayService.chat(any(), any()))
                .thenReturn(
                        new AiChatResult(aiJson, List.of(), null, null, "gemini-2.5-flash", null));

        CvParseProfileResponse response = service.parseCv(userId, file, null, "127.0.0.1");

        assertThat(response.readable()).isTrue();
        assertThat(response.profileEmpty()).isFalse();
        assertThat(response.diffs()).isNotEmpty();

        var headlineDiff =
                response.diffs().stream()
                        .filter(d -> d.field().equals("headline"))
                        .findFirst()
                        .orElseThrow();
        assertThat(headlineDiff.oldValue()).isEqualTo("Junior Web Developer");
        assertThat(headlineDiff.newValue()).isEqualTo("Fullstack Developer");
        assertThat(headlineDiff.hasChange()).isTrue();
    }

    @Test
    void applyParsedData_appliesSelectedFieldsOnly() {
        Long userId = 10L;
        CandidateProfile profile =
                CandidateProfile.builder().id(1L).userId(userId).bio("Original bio").build();
        when(profileLookup.findOrCreateForUpdate(userId)).thenReturn(profile);
        when(profileService.getMine(userId)).thenReturn(mock(CandidateProfileResource.class));

        ParsedProfileData data =
                ParsedProfileData.builder()
                        .headline("Staff Software Engineer")
                        .bio("Updated bio from CV")
                        .skills(
                                List.of(
                                        new SaveCandidateSkillRequest(
                                                "Go",
                                                SkillCategory.CORE,
                                                SkillLevel.PROFICIENT,
                                                2)))
                        .build();

        ApplyCvParsedRequest request =
                ApplyCvParsedRequest.builder()
                        .applyHeadline(true)
                        .applyBio(false) // User unselected bio!
                        .applySkills(true)
                        .parsedData(data)
                        .build();

        service.applyParsedData(userId, request);

        assertThat(profile.getHeadline()).isEqualTo("Staff Software Engineer");
        assertThat(profile.getBio()).isEqualTo("Original bio"); // Not overwritten!
        verify(profileRepository).save(profile);
    }
}
