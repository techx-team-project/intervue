package com.techx.intervue.modules.ai.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.CandidateRawData;
import com.techx.intervue.modules.ai.requests.ResumeMatchRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.AiStopReason;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.resources.RequirementEvidenceMatch;
import com.techx.intervue.modules.ai.resources.ResumeMatchResult;
import com.techx.intervue.modules.ai.services.impl.CandidatePrivacySanitizer;
import com.techx.intervue.modules.ai.services.impl.ResumeMatchService;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.ResumeMatchQuotaServiceInterface;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ResumeMatchServiceTest {

    @Mock private AiGatewayServiceInterface aiGatewayService;

    @Mock private PromptServiceInterface promptService;

    @Mock private ResumeMatchQuotaServiceInterface quotaService;

    private CandidatePrivacySanitizer privacySanitizer;
    private ObjectMapper objectMapper;
    private ResumeMatchService service;

    @BeforeEach
    void setUp() {
        privacySanitizer = new CandidatePrivacySanitizer();
        objectMapper = new ObjectMapper();
        service =
                new ResumeMatchService(
                        aiGatewayService,
                        promptService,
                        privacySanitizer,
                        quotaService,
                        objectMapper);
    }

    @Test
    @DisplayName("Should evaluate per-requirement evidence, summary and questions asynchronously")
    void shouldAnalyzePerRequirementEvidenceSummaryAndQuestions() throws Exception {
        PromptTemplate prompt =
                new PromptTemplate("resume-match.v1", 1, "System prompt for resume matching");
        when(promptService.load("resume-match", 1)).thenReturn(prompt);

        String modelJson =
                """
                {
                  "experienceSummary": "Ứng viên có 3 năm kinh nghiệm phát triển backend với Java và Spring Boot.",
                  "requirements": [
                    {
                      "requirement": "At least 2 years of Java/Spring Boot experience",
                      "hasEvidence": true,
                      "evidence": "3 years building microservices with Spring Boot at TechX"
                    },
                    {
                      "requirement": "Experience with Kubernetes cluster management",
                      "hasEvidence": false,
                      "evidence": "no evidence yet"
                    }
                  ],
                  "questionsToAsk": [
                    "Bạn đã từng tối ưu hiệu năng câu truy vấn cơ sở dữ liệu lớn như thế nào?",
                    "Chia sẻ kinh nghiệm làm việc với hạ tầng Kubernetes nếu có?"
                  ]
                }
                """;

        AiChatResult mockResult =
                new AiChatResult(
                        modelJson,
                        List.of(),
                        AiStopReason.END_TURN,
                        new AiUsage(250, 150),
                        "gemini-2.5-flash",
                        null);
        when(aiGatewayService.chat(any(AiCallContext.class), any(AiChatRequest.class)))
                .thenReturn(mockResult);

        CandidateRawData rawData =
                new CandidateRawData(
                        "Trần Văn B",
                        "Java Backend Engineer",
                        List.of("Java", "Spring Boot", "MySQL"),
                        "3 years in enterprise software",
                        List.of("TechX Global: 3 years building microservices with Spring Boot"),
                        List.of(),
                        List.of(),
                        null,
                        // PII fields to ensure they are NOT sent to AI
                        26,
                        2000,
                        "2000-01-01",
                        "MALE",
                        "https://example.com/avatar.png",
                        null,
                        "Hà Nội",
                        null,
                        null,
                        "012345678901",
                        null,
                        null,
                        List.of("Bạn có thể đi làm vào thứ Bảy không?"),
                        List.of("Không"));

        ResumeMatchRequest request =
                new ResumeMatchRequest(
                        "app-101",
                        "Backend Engineer (Java/Spring Boot)",
                        List.of(
                                "At least 2 years of Java/Spring Boot experience",
                                "Experience with Kubernetes cluster management"),
                        "Phát triển backend quy mô lớn",
                        rawData,
                        null);

        ResumeMatchResult result = service.analyze(1L, "127.0.0.1", request);

        // 1. Per-requirement evidence
        assertThat(result.requirements()).hasSize(2);

        RequirementEvidenceMatch req1 = result.requirements().get(0);
        assertThat(req1.requirement()).isEqualTo("At least 2 years of Java/Spring Boot experience");
        assertThat(req1.hasEvidence()).isTrue();
        assertThat(req1.evidence())
                .isEqualTo("3 years building microservices with Spring Boot at TechX");

        RequirementEvidenceMatch req2 = result.requirements().get(1);
        assertThat(req2.requirement()).isEqualTo("Experience with Kubernetes cluster management");
        assertThat(req2.hasEvidence()).isFalse();
        assertThat(req2.evidence()).isEqualTo("no evidence yet");
        assertThat(req2.clarificationNote())
                .contains("Missing information does not mean a missing skill");

        // 2. Short summary and questions
        assertThat(result.experienceSummary())
                .contains("3 năm kinh nghiệm phát triển backend với Java");
        assertThat(result.questionsToAsk()).hasSize(2);
        assertThat(result.questionsToAsk().get(0)).contains("tối ưu hiệu năng câu truy vấn");

        // 3. Model, prompt version, and AI processed label
        assertThat(result.model()).isEqualTo("gemini-2.5-flash");
        assertThat(result.promptVersion()).isEqualTo("resume-match.v1");
        assertThat(result.aiProcessedCandidateData()).isTrue();
        assertThat(result.analyzedAt()).isNotNull();
        assertThat(result.disclaimer())
                .contains("InterVue AI only assists with evidence-based evaluation");

        // 4. Verify no sensitive data or screening questions sent
        ArgumentCaptor<AiChatRequest> requestCaptor = ArgumentCaptor.forClass(AiChatRequest.class);
        verify(aiGatewayService).chat(any(AiCallContext.class), requestCaptor.capture());

        String capturedUserMessage =
                requestCaptor.getValue().messages().get(0).content().get(0).toString();
        assertThat(capturedUserMessage).doesNotContain("2000-01-01");
        assertThat(capturedUserMessage).doesNotContain("MALE");
        assertThat(capturedUserMessage).doesNotContain("012345678901");
        assertThat(capturedUserMessage).doesNotContain("avatar.png");
        assertThat(capturedUserMessage).doesNotContain("Bạn có thể đi làm vào thứ Bảy không?");
    }
}
