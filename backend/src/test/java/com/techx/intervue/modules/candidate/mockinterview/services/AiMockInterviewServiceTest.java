package com.techx.intervue.modules.candidate.mockinterview.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.AiStopReason;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateProfile;
import com.techx.intervue.modules.candidate.entities.CandidateResume;
import com.techx.intervue.modules.candidate.mockinterview.entities.AiMockInterview;
import com.techx.intervue.modules.candidate.mockinterview.entities.AiMockInterviewQuestion;
import com.techx.intervue.modules.candidate.mockinterview.enums.MockInterviewFocusArea;
import com.techx.intervue.modules.candidate.mockinterview.enums.MockInterviewStatus;
import com.techx.intervue.modules.candidate.mockinterview.repositories.AiMockInterviewQuestionRepository;
import com.techx.intervue.modules.candidate.mockinterview.repositories.AiMockInterviewRepository;
import com.techx.intervue.modules.candidate.mockinterview.requests.StartMockInterviewRequest;
import com.techx.intervue.modules.candidate.mockinterview.requests.SubmitMockAnswerRequest;
import com.techx.intervue.modules.candidate.mockinterview.requests.SubmitMockFollowUpRequest;
import com.techx.intervue.modules.candidate.mockinterview.resources.MockInterviewDetailResource;
import com.techx.intervue.modules.candidate.mockinterview.resources.SubmitAnswerResultResource;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.candidate.repositories.CandidateResumeRepository;
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AiMockInterviewServiceTest {

    @Mock private AiMockInterviewRepository interviewRepository;
    @Mock private AiMockInterviewQuestionRepository questionRepository;
    @Mock private CandidateProfileRepository profileRepository;
    @Mock private CandidateResumeRepository resumeRepository;
    @Mock private CandidateResumeServiceInterface resumeService;
    @Mock private CvTextExtractorServiceInterface cvTextExtractorService;
    @Mock private CandidatePrivacySanitizerInterface privacySanitizer;
    @Mock private AiGatewayServiceInterface aiGatewayService;
    @Mock private PromptServiceInterface promptService;

    private ObjectMapper objectMapper;
    private CandidateMockInterviewService service;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        service =
                new CandidateMockInterviewService(
                        interviewRepository,
                        questionRepository,
                        profileRepository,
                        resumeRepository,
                        resumeService,
                        cvTextExtractorService,
                        privacySanitizer,
                        aiGatewayService,
                        promptService,
                        objectMapper);
    }

    @Test
    @DisplayName("Should start session with 5 to 10 questions and sanitize candidate CV")
    void shouldStartSessionWithQuestions() {
        Long candidateId = 1L;
        CandidateProfile profile = CandidateProfile.builder().id(10L).headline("Java Dev").build();
        when(profileRepository.findByUserId(candidateId)).thenReturn(Optional.of(profile));

        CandidateResume resume =
                CandidateResume.builder().id(100L).candidateProfile(profile).build();
        when(resumeRepository.findByIdAndCandidateProfileId(100L, 10L))
                .thenReturn(Optional.of(resume));
        when(resumeService.download(100L, candidateId))
                .thenReturn(new ResumeContent("cv.pdf", "application/pdf", new byte[] {1, 2}));
        when(cvTextExtractorService.extractText(any(byte[].class)))
                .thenReturn(CvTextExtractionResult.readable("hash", "Raw CV content", 1, false));
        when(privacySanitizer.sanitizeCandidateData(eq(null), anyString()))
                .thenReturn("Sanitized CV without screening questions or PII");

        when(promptService.load(eq("mock-interview-init"), eq(1)))
                .thenReturn(new PromptTemplate("mock-interview-init.v1", 1, "Prompt"));

        String aiJson =
                """
                {
                  "questions": [
                    {"order": 1, "category": "TECHNICAL", "questionText": "Q1: Explain Java Memory Model"},
                    {"order": 2, "category": "TECHNICAL", "questionText": "Q2: How does garbage collection work?"},
                    {"order": 3, "category": "TECHNICAL", "questionText": "Q3: Optimize SQL queries"},
                    {"order": 4, "category": "SYSTEM_DESIGN", "questionText": "Q4: Design a rate limiter"},
                    {"order": 5, "category": "BEHAVIORAL", "questionText": "Q5: How do you handle conflict?"}
                  ]
                }
                """;
        when(aiGatewayService.chat(any(AiCallContext.class), any(AiChatRequest.class)))
                .thenReturn(
                        new AiChatResult(
                                aiJson,
                                List.of(),
                                AiStopReason.END_TURN,
                                new AiUsage(100, 50),
                                "gemini-3.8-flash",
                                null));

        when(interviewRepository.save(any(AiMockInterview.class)))
                .thenAnswer(
                        inv -> {
                            AiMockInterview saved = inv.getArgument(0);
                            saved.setId(500L);
                            return saved;
                        });
        when(questionRepository.save(any(AiMockInterviewQuestion.class)))
                .thenAnswer(
                        inv -> {
                            AiMockInterviewQuestion q = inv.getArgument(0);
                            q.setId(q.getQuestionOrder().longValue());
                            return q;
                        });

        StartMockInterviewRequest request =
                StartMockInterviewRequest.builder()
                        .resumeId(100L)
                        .targetRole("Senior Java Engineer")
                        .seniorityLevel("Senior")
                        .focusArea(MockInterviewFocusArea.TECHNICAL)
                        .questionCount(5)
                        .build();

        MockInterviewDetailResource result =
                service.startSession(candidateId, request, "127.0.0.1");

        assertThat(result).isNotNull();
        assertThat(result.targetRole()).isEqualTo("Senior Java Engineer");
        assertThat(result.questionCount()).isEqualTo(5);
        assertThat(result.status()).isEqualTo(MockInterviewStatus.IN_PROGRESS);
        verify(privacySanitizer).sanitizeCandidateData(eq(null), eq("Raw CV content"));
    }

    @Test
    @DisplayName("Should enforce at most one follow-up question per main question")
    void shouldEnforceMaxOneFollowUp() {
        Long candidateId = 1L;
        Long sessionId = 500L;
        Long questionId = 1L;

        AiMockInterview interview =
                AiMockInterview.builder()
                        .id(sessionId)
                        .candidateId(candidateId)
                        .targetRole("Senior Java")
                        .seniorityLevel("Senior")
                        .focusArea(MockInterviewFocusArea.TECHNICAL)
                        .questionCount(5)
                        .currentQuestionIndex(0)
                        .status(MockInterviewStatus.IN_PROGRESS)
                        .build();
        when(interviewRepository.findByIdAndCandidateId(sessionId, candidateId))
                .thenReturn(Optional.of(interview));

        AiMockInterviewQuestion q1 =
                AiMockInterviewQuestion.builder()
                        .id(questionId)
                        .mockInterview(interview)
                        .questionOrder(1)
                        .category("TECHNICAL")
                        .questionText("Explain Java Memory Model")
                        .build();
        when(questionRepository.findByIdAndMockInterviewId(questionId, sessionId))
                .thenReturn(Optional.of(q1));

        when(promptService.load(eq("mock-interview-evaluate"), eq(1)))
                .thenReturn(new PromptTemplate("mock-interview-evaluate.v1", 1, "Prompt"));

        // First answer needs follow-up
        String evalJsonWithFollowUp =
                """
                {
                  "score": 75,
                  "needsFollowUp": true,
                  "followUpQuestion": "Can you explain the happens-before relationship in detail?",
                  "feedback": "Good answer on heap and stack, but concurrency details were missing.",
                  "idealAnswer": "Should mention volatile and synchronization."
                }
                """;
        when(aiGatewayService.chat(any(AiCallContext.class), any(AiChatRequest.class)))
                .thenReturn(
                        new AiChatResult(
                                evalJsonWithFollowUp,
                                List.of(),
                                AiStopReason.END_TURN,
                                new AiUsage(100, 50),
                                "gemini-3.8-flash",
                                null));

        SubmitAnswerResultResource firstAnsResult =
                service.submitAnswer(
                        candidateId,
                        sessionId,
                        questionId,
                        new SubmitMockAnswerRequest(
                                "Heap stores objects and stack stores method frames."),
                        "127.0.0.1");

        assertThat(firstAnsResult.needsFollowUp()).isTrue();
        assertThat(firstAnsResult.followUpQuestion()).contains("happens-before");
        assertThat(firstAnsResult.sessionCompleted()).isFalse();
        // Index must still be 0 (candidate must answer follow-up)
        assertThat(interview.getCurrentQuestionIndex()).isEqualTo(0);

        // Now candidate submits follow-up answer
        String evalJsonFollowUpResolved =
                """
                {
                  "score": 90,
                  "needsFollowUp": false,
                  "followUpQuestion": null,
                  "feedback": "Excellent explanation of volatile and memory barriers.",
                  "idealAnswer": "Great answer."
                }
                """;
        when(aiGatewayService.chat(any(AiCallContext.class), any(AiChatRequest.class)))
                .thenReturn(
                        new AiChatResult(
                                evalJsonFollowUpResolved,
                                List.of(),
                                AiStopReason.END_TURN,
                                new AiUsage(100, 50),
                                "gemini-3.8-flash",
                                null));

        AiMockInterviewQuestion q2 =
                AiMockInterviewQuestion.builder()
                        .id(2L)
                        .mockInterview(interview)
                        .questionOrder(2)
                        .category("TECHNICAL")
                        .questionText("Question 2")
                        .build();
        when(questionRepository.findAllByMockInterviewIdOrderByQuestionOrderAsc(sessionId))
                .thenReturn(List.of(q1, q2));
        when(interviewRepository.save(any(AiMockInterview.class))).thenReturn(interview);

        SubmitAnswerResultResource followUpResult =
                service.submitFollowUp(
                        candidateId,
                        sessionId,
                        questionId,
                        new SubmitMockFollowUpRequest(
                                "Volatile ensures visibility and memory barriers prevent reordering."),
                        "127.0.0.1");

        assertThat(followUpResult.needsFollowUp()).isFalse();
        assertThat(followUpResult.followUpQuestion()).isNull();
        assertThat(followUpResult.score()).isEqualTo(90);
        // Index advanced to 1 for question 2!
        assertThat(interview.getCurrentQuestionIndex()).isEqualTo(1);
    }

    @Test
    @DisplayName(
            "Should generate overall summary with exactly 3 strengths and 3 improvements upon completion")
    void shouldCompleteSessionWith3StrengthsAnd3Improvements() {
        Long candidateId = 1L;
        Long sessionId = 600L;
        Long questionId = 5L;

        AiMockInterview interview =
                AiMockInterview.builder()
                        .id(sessionId)
                        .candidateId(candidateId)
                        .targetRole("Senior Java")
                        .seniorityLevel("Senior")
                        .focusArea(MockInterviewFocusArea.TECHNICAL)
                        .questionCount(5)
                        .currentQuestionIndex(4) // Last question (index 4 of 5)
                        .status(MockInterviewStatus.IN_PROGRESS)
                        .build();
        when(interviewRepository.findByIdAndCandidateId(sessionId, candidateId))
                .thenReturn(Optional.of(interview));

        AiMockInterviewQuestion q5 =
                AiMockInterviewQuestion.builder()
                        .id(questionId)
                        .mockInterview(interview)
                        .questionOrder(5)
                        .category("BEHAVIORAL")
                        .questionText("Handling conflict")
                        .build();
        when(questionRepository.findByIdAndMockInterviewId(questionId, sessionId))
                .thenReturn(Optional.of(q5));

        when(promptService.load(eq("mock-interview-evaluate"), eq(1)))
                .thenReturn(new PromptTemplate("mock-interview-evaluate.v1", 1, "Prompt"));
        when(promptService.load(eq("mock-interview-summary"), eq(1)))
                .thenReturn(new PromptTemplate("mock-interview-summary.v1", 1, "Prompt"));

        String evalLastQ =
                """
                {
                  "score": 85,
                  "needsFollowUp": false,
                  "followUpQuestion": null,
                  "feedback": "Good conflict resolution example.",
                  "idealAnswer": "STAR method"
                }
                """;
        String summaryJson =
                """
                {
                  "overallScore": 88,
                  "overallFeedback": "Ứng viên có kiến thức chuyên môn vững vàng và tư duy giải quyết vấn đề tốt.",
                  "strengths": [
                    "Nắm vững kiến thức cốt lõi về Java Concurrency và Memory Model",
                    "Khả năng tư duy kiến trúc và phân tích trade-off rõ ràng",
                    "Phong thái giao tiếp tự tin và phong cách trả lời rành mạch"
                  ],
                  "improvements": [
                    "Cần bổ sung các số liệu định lượng về kết quả đạt được trong dự án",
                    "Đào sâu hơn vào cơ chế distributed transaction khi thiết kế microservices",
                    "Cần chủ động nêu các rủi ro kỹ thuật và phương án dự phòng"
                  ]
                }
                """;

        when(aiGatewayService.chat(any(AiCallContext.class), any(AiChatRequest.class)))
                .thenReturn(
                        new AiChatResult(
                                evalLastQ,
                                List.of(),
                                AiStopReason.END_TURN,
                                new AiUsage(100, 50),
                                "gemini-3.8-flash",
                                null))
                .thenReturn(
                        new AiChatResult(
                                summaryJson,
                                List.of(),
                                AiStopReason.END_TURN,
                                new AiUsage(200, 100),
                                "gemini-3.8-flash",
                                null));

        when(interviewRepository.save(any(AiMockInterview.class))).thenReturn(interview);
        when(questionRepository.findAllByMockInterviewIdOrderByQuestionOrderAsc(sessionId))
                .thenReturn(List.of(q5));

        SubmitAnswerResultResource result =
                service.submitAnswer(
                        candidateId,
                        sessionId,
                        questionId,
                        new SubmitMockAnswerRequest("I listen actively and find common ground."),
                        "127.0.0.1");

        assertThat(result.sessionCompleted()).isTrue();
        assertThat(interview.getStatus()).isEqualTo(MockInterviewStatus.COMPLETED);
        assertThat(interview.getOverallScore()).isEqualTo(88);
        assertThat(interview.getStrengthsJson()).contains("Java Concurrency");
        assertThat(interview.getImprovementsJson()).contains("distributed transaction");

        MockInterviewDetailResource completed = result.completedSession();
        assertThat(completed).isNotNull();
        assertThat(completed.strengths()).hasSize(3);
        assertThat(completed.improvements()).hasSize(3);
    }

    @Test
    @DisplayName(
            "Verify security constraint: Mock interview never reads or references real screening questions")
    void verifyNeverReadsScreeningQuestionsSecurity() {
        Field[] fields = CandidateMockInterviewService.class.getDeclaredFields();
        for (Field field : fields) {
            String typeName = field.getType().getSimpleName().toLowerCase();
            assertThat(typeName)
                    .as("Service must not inject JobScreeningQuestion repository or service")
                    .doesNotContain("screening");
        }
    }
}
