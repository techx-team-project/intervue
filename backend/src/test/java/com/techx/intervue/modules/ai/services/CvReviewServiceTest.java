package com.techx.intervue.modules.ai.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.entities.AiCvReview;
import com.techx.intervue.modules.ai.repositories.AiCvReviewRepository;
import com.techx.intervue.modules.ai.requests.CvReviewRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.AiStopReason;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.resources.CvReviewComment;
import com.techx.intervue.modules.ai.resources.CvReviewResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.impl.CvReviewService;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import com.techx.intervue.modules.ai.services.interfaces.CvReviewQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.repositories.CandidateResumeRepository;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileLookup;
import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CvReviewServiceTest {

    private CandidateProfileLookup candidateProfileLookup;
    private CandidateResumeRepository candidateResumeRepository;
    private AiCvReviewRepository aiCvReviewRepository;
    private CvReviewQuotaServiceInterface quotaService;
    private CvTextExtractorServiceInterface cvTextExtractorService;
    private CvTextCleaner cvTextCleaner;
    private CandidatePrivacySanitizerInterface privacySanitizer;
    private PromptServiceInterface promptService;
    private AiGatewayServiceInterface aiGatewayService;
    private ObjectMapper objectMapper;

    private CvReviewService cvReviewService;

    @BeforeEach
    void setUp() {
        candidateProfileLookup = mock(CandidateProfileLookup.class);
        candidateResumeRepository = mock(CandidateResumeRepository.class);
        aiCvReviewRepository = mock(AiCvReviewRepository.class);
        quotaService = mock(CvReviewQuotaServiceInterface.class);
        cvTextExtractorService = mock(CvTextExtractorServiceInterface.class);
        cvTextCleaner = mock(CvTextCleaner.class);
        privacySanitizer = mock(CandidatePrivacySanitizerInterface.class);
        promptService = mock(PromptServiceInterface.class);
        aiGatewayService = mock(AiGatewayServiceInterface.class);
        objectMapper = new ObjectMapper();

        cvReviewService =
                new CvReviewService(
                        candidateProfileLookup,
                        candidateResumeRepository,
                        aiCvReviewRepository,
                        quotaService,
                        cvTextExtractorService,
                        cvTextCleaner,
                        privacySanitizer,
                        promptService,
                        aiGatewayService,
                        objectMapper);
    }

    @Test
    void reviewCv_unchangedCv_returnsCachedResultWithoutUsingQuota() {
        Long candidateUserId = 50L;
        CandidateProfile profile =
                CandidateProfile.builder()
                        .id(10L)
                        .userId(candidateUserId)
                        .headline("Java Dev")
                        .build();
        when(candidateProfileLookup.require(candidateUserId)).thenReturn(profile);
        when(cvTextCleaner.clean(anyString()))
                .thenReturn("Experienced Java Developer with Spring Boot.");

        AiCvReview existing =
                AiCvReview.builder()
                        .id(1L)
                        .candidateProfile(profile)
                        .fileHash("mock-hash")
                        .overallScore(85)
                        .summary("Solid Java CV")
                        .commentsJson(
                                """
                                [
                                  {
                                    "section": "Experience",
                                    "quote": "worked on microservices",
                                    "problem": "Lacks specific scale and metrics",
                                    "fix": "Engineered 5 Spring Boot microservices handling 2M requests/day"
                                  }
                                ]
                                """)
                        .modelVersion("gemini-2.5-flash")
                        .promptVersion("cv-feedback.v1")
                        .build();

        when(aiCvReviewRepository.findFirstByCandidateProfileIdAndFileHashOrderByCreatedAtDesc(
                        eq(10L), anyString()))
                .thenReturn(Optional.of(existing));

        CvReviewRequest request =
                new CvReviewRequest(
                        null, "Experienced Java Developer with Spring Boot.", "Java Developer");
        CvReviewResult result = cvReviewService.reviewCv(candidateUserId, "127.0.0.1", request);

        assertThat(result.fromCache()).isTrue();
        assertThat(result.overallScore()).isEqualTo(85);
        assertThat(result.comments()).hasSize(1);
        assertThat(result.comments().get(0).quote()).isEqualTo("worked on microservices");
        assertThat(result.comments().get(0).problem())
                .isEqualTo("Lacks specific scale and metrics");
        assertThat(result.comments().get(0).fix())
                .isEqualTo("Engineered 5 Spring Boot microservices handling 2M requests/day");

        // Verify quota was NEVER consumed for unchanged CV
        verify(quotaService, never()).checkAndConsumeQuota(any());
        verify(aiGatewayService, never()).chat(any(), any());
    }

    @Test
    void reviewCv_newCv_consumesQuotaAndReturnsQuoteProblemFixComments() {
        Long candidateUserId = 50L;
        CandidateProfile profile =
                CandidateProfile.builder()
                        .id(10L)
                        .userId(candidateUserId)
                        .headline("Frontend React")
                        .build();
        when(candidateProfileLookup.require(candidateUserId)).thenReturn(profile);
        when(cvTextCleaner.clean(anyString())).thenReturn("React Developer 2 years.");
        when(aiCvReviewRepository.findFirstByCandidateProfileIdAndFileHashOrderByCreatedAtDesc(
                        eq(10L), anyString()))
                .thenReturn(Optional.empty());

        when(privacySanitizer.sanitizeCandidateData(any(), anyString())).thenReturn("Sanitized CV");
        when(promptService.load(anyString(), eq(1)))
                .thenReturn(new PromptTemplate("cv-feedback", 1, "Review prompt template"));

        String aiReply =
                """
                {
                  "summary": "Good frontend foundation, needs impact metrics.",
                  "overallScore": 80,
                  "comments": [
                    {
                      "section": "Projects",
                      "quote": "built web interfaces",
                      "problem": "Generic description without business value",
                      "fix": "Developed responsive dashboard using Next.js, boosting user engagement by 30%"
                    }
                  ]
                }
                """;

        when(aiGatewayService.chat(any(), any()))
                .thenReturn(
                        new AiChatResult(
                                aiReply,
                                List.of(),
                                AiStopReason.END_TURN,
                                new AiUsage(100, 200),
                                "gemini-2.5-flash",
                                null));

        when(aiCvReviewRepository.save(any(AiCvReview.class)))
                .thenAnswer(
                        inv -> {
                            AiCvReview saved = inv.getArgument(0);
                            saved.setId(99L);
                            return saved;
                        });

        CvReviewRequest request =
                new CvReviewRequest(null, "React Developer 2 years.", "Frontend Developer");
        CvReviewResult result = cvReviewService.reviewCv(candidateUserId, "127.0.0.1", request);

        assertThat(result.fromCache()).isFalse();
        assertThat(result.overallScore()).isEqualTo(80);
        assertThat(result.comments()).hasSize(1);

        CvReviewComment comment = result.comments().get(0);
        assertThat(comment.quote()).isEqualTo("built web interfaces");
        assertThat(comment.problem()).isEqualTo("Generic description without business value");
        assertThat(comment.fix())
                .isEqualTo(
                        "Developed responsive dashboard using Next.js, boosting user engagement by 30%");

        // Verify quota was consumed once
        verify(quotaService).checkAndConsumeQuota(candidateUserId);
        verify(aiCvReviewRepository).save(any(AiCvReview.class));
    }

    @Test
    void getReviewById_enforcesCandidateOnlyAccess() {
        Long ownerUserId = 100L;
        Long otherUserId = 200L;
        CandidateProfile ownerProfile =
                CandidateProfile.builder().id(5L).userId(ownerUserId).build();

        AiCvReview review =
                AiCvReview.builder()
                        .id(10L)
                        .candidateProfile(ownerProfile)
                        .fileHash("hash")
                        .commentsJson("[]")
                        .modelVersion("gemini")
                        .promptVersion("v1")
                        .build();

        when(aiCvReviewRepository.findById(10L)).thenReturn(Optional.of(review));

        // When another user requests the review, not found exception is thrown (prevents IDOR)
        assertThatThrownBy(() -> cvReviewService.getReviewById(otherUserId, 10L))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.NOT_FOUND);

        // When the owner requests, it succeeds
        CvReviewResult result = cvReviewService.getReviewById(ownerUserId, 10L);
        assertThat(result.id()).isEqualTo(10L);
    }
}
