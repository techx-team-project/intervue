package com.techx.intervue.modules.ai.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.CoverLetterGenerateRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.AiStopReason;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.resources.CoverLetterGenerateResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.impl.CoverLetterService;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateResumeRepository;
import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CoverLetterServiceTest {

    private CandidateProfileRepository profileRepository;
    private CandidateResumeRepository resumeRepository;
    private CvTextCleaner cvTextCleaner;
    private CandidatePrivacySanitizerInterface privacySanitizer;
    private PromptServiceInterface promptService;
    private AiGatewayServiceInterface aiGatewayService;

    private CoverLetterService coverLetterService;

    @BeforeEach
    void setUp() {
        profileRepository = mock(CandidateProfileRepository.class);
        resumeRepository = mock(CandidateResumeRepository.class);
        cvTextCleaner = mock(CvTextCleaner.class);
        privacySanitizer = mock(CandidatePrivacySanitizerInterface.class);
        promptService = mock(PromptServiceInterface.class);
        aiGatewayService = mock(AiGatewayServiceInterface.class);

        coverLetterService =
                new CoverLetterService(
                        profileRepository,
                        resumeRepository,
                        cvTextCleaner,
                        privacySanitizer,
                        promptService,
                        aiGatewayService);
    }

    @Test
    void generateCoverLetter_validInput_usesCvAndJobFacts() {
        CoverLetterGenerateRequest request =
                new CoverLetterGenerateRequest(
                        "Senior Backend Engineer",
                        "TechX Corp",
                        List.of("3+ years Java/Spring Boot", "MySQL optimization"),
                        "Develop high throughput microservices",
                        null,
                        "3 years building microservices at FPT, Spring Boot, Redis, MySQL",
                        "Nguyen Van A");

        when(cvTextCleaner.clean(anyString()))
                .thenReturn("3 years building microservices at FPT, Spring Boot, Redis, MySQL");
        when(privacySanitizer.sanitizeCandidateData(any(), anyString()))
                .thenReturn("3 years building microservices at FPT, Spring Boot, Redis, MySQL");
        when(promptService.load(eq("cover-letter"), eq(1)))
                .thenReturn(new PromptTemplate("cover-letter", 1, "Template"));

        String aiDraft =
                "Dear Hiring Team, I am writing to apply for the Senior Backend Engineer role at TechX Corp...";
        when(aiGatewayService.chat(any(), any()))
                .thenReturn(
                        new AiChatResult(
                                aiDraft,
                                List.of(),
                                AiStopReason.END_TURN,
                                new AiUsage(150, 250),
                                "gemini-2.5-flash",
                                null));

        CoverLetterGenerateResult result =
                coverLetterService.generateCoverLetter(1L, "127.0.0.1", request);

        assertThat(result.coverLetter()).isEqualTo(aiDraft);
        assertThat(result.modelVersion()).isEqualTo("gemini-2.5-flash");
        assertThat(result.notice()).contains("Bản nháp");

        verify(privacySanitizer).validateNoSensitiveDataSent(anyString());
        verify(aiGatewayService).chat(any(), any());
    }

    @Test
    void generateCoverLetter_missingJobTitle_throwsValidationFailed() {
        CoverLetterGenerateRequest request =
                new CoverLetterGenerateRequest(
                        "", "TechX Corp", List.of(), null, null, "Some CV text", "User");

        assertThatThrownBy(() -> coverLetterService.generateCoverLetter(1L, "127.0.0.1", request))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.VALIDATION_FAILED);
    }
}
