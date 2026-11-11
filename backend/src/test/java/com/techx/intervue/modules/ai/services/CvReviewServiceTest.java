package com.techx.intervue.modules.ai.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
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
import com.techx.intervue.modules.ai.resources.JobRequirementMatch;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.impl.CvReviewService;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import com.techx.intervue.modules.ai.services.interfaces.CvReviewQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.credits.services.CandidateCreditServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.repositories.CandidateResumeRepository;
import com.techx.intervue.modules.candidate.services.impl.CandidateProfileLookup;
import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.repositories.JobRepository;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
    private JobRepository jobRepository;
    private CandidateCreditServiceInterface candidateCreditService;

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
        jobRepository = mock(JobRepository.class);
        candidateCreditService = mock(CandidateCreditServiceInterface.class);

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
                        objectMapper,
                        jobRepository,
                        candidateCreditService);
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
                        .summary("Solid CV")
                        .commentsJson("[]")
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
        assertThat(result.summary()).isEqualTo("Solid CV");

        // Quota should NOT be consumed on cache hit
        verify(quotaService, never()).checkAndConsumeQuota(candidateUserId);
        verify(aiGatewayService, never()).chat(any(), any());
    }

    @Test
    void reviewCv_validCv_generatesStructuredFeedbackWithQuotesAndProblemFix() {
        Long candidateUserId = 50L;
        CandidateProfile profile =
                CandidateProfile.builder()
                        .id(10L)
                        .userId(candidateUserId)
                        .headline("Frontend Dev")
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
    void reviewCv_level3_chargedPerUse_andPerRequirementComparisonSuccess() {
        Long candidateUserId = 50L;
        Long jobId = 101L;
        CandidateProfile profile =
                CandidateProfile.builder().id(10L).userId(candidateUserId).build();
        Job job =
                Job.builder()
                        .id(jobId)
                        .title("Senior Java Developer")
                        .companyName("TechX Global")
                        .requirements("3+ years Java Spring Boot. Experience with AWS cloud.")
                        .skills(Set.of())
                        .build();

        when(candidateProfileLookup.require(candidateUserId)).thenReturn(profile);
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(cvTextCleaner.clean(anyString()))
                .thenReturn("Java developer with 4 years Spring Boot and Docker.");
        when(aiCvReviewRepository
                        .findFirstByCandidateProfileIdAndFileHashAndJobIdAndReviewLevelOrderByCreatedAtDesc(
                                eq(10L), anyString(), eq(jobId), eq(3)))
                .thenReturn(Optional.empty());

        when(privacySanitizer.sanitizeCandidateData(any(), anyString()))
                .thenReturn("Sanitized CV Content");
        when(promptService.load(eq("cv-feedback-job-fit"), eq(1)))
                .thenReturn(
                        new PromptTemplate("cv-feedback-job-fit", 1, "Job fit prompt template"));

        String aiReply =
                """
                {
                  "jobFitScore": 88,
                  "summary": "Ứng viên có sự phù hợp rất cao với vị trí Senior Java Developer.",
                  "requirementMatches": [
                    {
                      "requirement": "3+ years Java Spring Boot",
                      "status": "MATCH",
                      "cvEvidence": "4 years Spring Boot experience",
                      "explanation": "Đạt yêu cầu về số năm kinh nghiệm và chuyên môn sâu.",
                      "fitScore": 95,
                      "improvementTip": "Bổ sung thêm quy mô dự án microservices."
                    },
                    {
                      "requirement": "Experience with AWS cloud",
                      "status": "PARTIAL",
                      "cvEvidence": "Docker containerization",
                      "explanation": "Có kiến thức container nhưng chưa nêu rõ AWS dịch vụ cụ thể.",
                      "fitScore": 70,
                      "improvementTip": "Nêu rõ các dịch vụ AWS đã sử dụng như ECS, S3, RDS."
                    }
                  ],
                  "keyStrengths": ["Kinh nghiệm Java vững chắc", "Có kiến thức DevOps Docker", "Tư duy hệ thống tốt"],
                  "gapAnalysis": ["Thiếu chứng chỉ hoặc kinh nghiệm AWS cụ thể", "Chưa nêu quy mô hệ thống", "Cần bổ sung metrics"],
                  "tailoringTips": ["Thêm từ khóa AWS vào mục Skills", "Nêu metrics hiệu năng API", "Làm nổi bật kiến trúc Spring"],
                  "comments": []
                }
                """;

        when(aiGatewayService.chat(any(), any()))
                .thenReturn(
                        new AiChatResult(
                                aiReply,
                                List.of(),
                                AiStopReason.END_TURN,
                                new AiUsage(150, 300),
                                "gemini-2.5-flash",
                                null));

        when(aiCvReviewRepository.save(any(AiCvReview.class)))
                .thenAnswer(
                        inv -> {
                            AiCvReview saved = inv.getArgument(0);
                            saved.setId(202L);
                            return saved;
                        });

        CvReviewRequest request =
                new CvReviewRequest(
                        null,
                        "Java developer with 4 years Spring Boot and Docker.",
                        null,
                        jobId,
                        3);

        CvReviewResult result = cvReviewService.reviewCv(candidateUserId, "127.0.0.1", request);

        // Verify charged 1 credit
        verify(candidateCreditService)
                .charge(
                        eq(profile),
                        eq(1),
                        eq("CV_REVIEW_LEVEL_3"),
                        eq(jobId.toString()),
                        anyString());

        // Verify result assertions
        assertThat(result.reviewLevel()).isEqualTo(3);
        assertThat(result.jobFitScore()).isEqualTo(88);
        assertThat(result.jobId()).isEqualTo(jobId);
        assertThat(result.jobTitle()).isEqualTo("Senior Java Developer");
        assertThat(result.companyName()).isEqualTo("TechX Global");
        assertThat(result.requirementMatches()).hasSize(2);

        JobRequirementMatch match1 = result.requirementMatches().get(0);
        assertThat(match1.requirement()).isEqualTo("3+ years Java Spring Boot");
        assertThat(match1.status()).isEqualTo("MATCH");
        assertThat(match1.cvEvidence()).isEqualTo("4 years Spring Boot experience");
        assertThat(match1.fitScore()).isEqualTo(95);

        JobRequirementMatch match2 = result.requirementMatches().get(1);
        assertThat(match2.requirement()).isEqualTo("Experience with AWS cloud");
        assertThat(match2.status()).isEqualTo("PARTIAL");

        assertThat(result.keyStrengths()).hasSize(3);
        assertThat(result.gapAnalysis()).hasSize(3);
        assertThat(result.tailoringTips()).hasSize(3);

        // Verify quota was NOT touched for level 3 paid review
        verify(quotaService, never()).checkAndConsumeQuota(any());
        // Verify no refund was triggered
        verify(candidateCreditService, never())
                .refund(any(), anyInt(), anyString(), anyString(), anyString());
    }

    @Test
    void reviewCv_level3_cacheHit_doesNotChargeCredit() {
        Long candidateUserId = 50L;
        Long jobId = 101L;
        CandidateProfile profile =
                CandidateProfile.builder().id(10L).userId(candidateUserId).build();
        Job job = Job.builder().id(jobId).title("Java Dev").companyName("TechX").build();

        when(candidateProfileLookup.require(candidateUserId)).thenReturn(profile);
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(cvTextCleaner.clean(anyString())).thenReturn("Java developer CV text");

        AiCvReview existingLevel3 =
                AiCvReview.builder()
                        .id(301L)
                        .candidateProfile(profile)
                        .job(job)
                        .reviewLevel(3)
                        .fileHash("cached-hash")
                        .overallScore(85)
                        .jobFitScore(85)
                        .commentsJson("[]")
                        .requirementMatchesJson("{\"requirementMatches\":[]}")
                        .modelVersion("gemini")
                        .promptVersion("cv-feedback-job-fit.v1")
                        .chargedCredits(1)
                        .build();

        when(aiCvReviewRepository
                        .findFirstByCandidateProfileIdAndFileHashAndJobIdAndReviewLevelOrderByCreatedAtDesc(
                                eq(10L), anyString(), eq(jobId), eq(3)))
                .thenReturn(Optional.of(existingLevel3));

        CvReviewRequest request =
                new CvReviewRequest(null, "Java developer CV text", null, jobId, 3);
        CvReviewResult result = cvReviewService.reviewCv(candidateUserId, "127.0.0.1", request);

        assertThat(result.fromCache()).isTrue();
        assertThat(result.jobFitScore()).isEqualTo(85);

        // Crucial: No credit should be charged on cache hit!
        verify(candidateCreditService, never())
                .charge(any(), anyInt(), anyString(), anyString(), anyString());
        verify(aiGatewayService, never()).chat(any(), any());
    }

    @Test
    void reviewCv_level3_automaticRefundWhenAiFails() {
        Long candidateUserId = 50L;
        Long jobId = 101L;
        CandidateProfile profile =
                CandidateProfile.builder().id(10L).userId(candidateUserId).build();
        Job job = Job.builder().id(jobId).title("Java Dev").companyName("TechX").build();

        when(candidateProfileLookup.require(candidateUserId)).thenReturn(profile);
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(cvTextCleaner.clean(anyString())).thenReturn("Java developer CV text");
        when(aiCvReviewRepository
                        .findFirstByCandidateProfileIdAndFileHashAndJobIdAndReviewLevelOrderByCreatedAtDesc(
                                eq(10L), anyString(), eq(jobId), eq(3)))
                .thenReturn(Optional.empty());

        when(privacySanitizer.sanitizeCandidateData(any(), anyString())).thenReturn("Sanitized CV");
        when(promptService.load(anyString(), anyInt()))
                .thenReturn(new PromptTemplate("cv-feedback-job-fit", 1, "Template"));

        // Simulate AI service failure (timeout / provider error)
        when(aiGatewayService.chat(any(), any()))
                .thenThrow(new RuntimeException("Gemini API connection timed out"));

        CvReviewRequest request =
                new CvReviewRequest(null, "Java developer CV text", null, jobId, 3);

        // Expect exception to be thrown
        assertThatThrownBy(() -> cvReviewService.reviewCv(candidateUserId, "127.0.0.1", request))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AI_PROVIDER_ERROR);

        // VERIFY: Credit was initially charged...
        verify(candidateCreditService)
                .charge(
                        eq(profile),
                        eq(1),
                        eq("CV_REVIEW_LEVEL_3"),
                        eq(jobId.toString()),
                        anyString());

        // AND AUTOMATICALLY REFUNDED upon AI failure!
        verify(candidateCreditService)
                .refund(
                        eq(profile),
                        eq(1),
                        eq("CV_REVIEW_LEVEL_3"),
                        eq(jobId.toString()),
                        anyString());
    }

    @Test
    void reviewCv_level3_insufficientCredits_throwsErrorWithoutCallingAi() {
        Long candidateUserId = 50L;
        Long jobId = 101L;
        CandidateProfile profile =
                CandidateProfile.builder().id(10L).userId(candidateUserId).build();
        Job job = Job.builder().id(jobId).title("Java Dev").companyName("TechX").build();

        when(candidateProfileLookup.require(candidateUserId)).thenReturn(profile);
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(cvTextCleaner.clean(anyString())).thenReturn("Java developer CV text");
        when(aiCvReviewRepository
                        .findFirstByCandidateProfileIdAndFileHashAndJobIdAndReviewLevelOrderByCreatedAtDesc(
                                eq(10L), anyString(), eq(jobId), eq(3)))
                .thenReturn(Optional.empty());

        // Simulate insufficient credits
        doThrow(new AppException(ErrorCode.INSUFFICIENT_CREDITS))
                .when(candidateCreditService)
                .charge(any(), eq(1), anyString(), anyString(), anyString());

        CvReviewRequest request =
                new CvReviewRequest(null, "Java developer CV text", null, jobId, 3);

        assertThatThrownBy(() -> cvReviewService.reviewCv(candidateUserId, "127.0.0.1", request))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.INSUFFICIENT_CREDITS);

        // AI was NEVER called
        verify(aiGatewayService, never()).chat(any(), any());
        // No refund because charge didn't succeed
        verify(candidateCreditService, never())
                .refund(any(), anyInt(), anyString(), anyString(), anyString());
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
