package com.techx.intervue.modules.ai.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.UserChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.AiStopReason;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.resources.UserChatResponse;
import com.techx.intervue.modules.ai.services.impl.AiChatService;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.AiQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.KnowledgeBaseServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import java.lang.reflect.Field;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;

@ExtendWith(MockitoExtension.class)
class AiChatServiceTest {

    @Mock private AiGatewayServiceInterface aiGatewayService;

    @Mock private KnowledgeBaseServiceInterface knowledgeBaseService;

    @Mock private AiQuotaServiceInterface quotaService;

    @Mock private PromptServiceInterface promptService;

    @Mock private StringRedisTemplate redis;

    @Mock private ListOperations<String, String> listOperations;

    private ObjectMapper objectMapper;
    private AiChatService service;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        service =
                new AiChatService(
                        aiGatewayService,
                        knowledgeBaseService,
                        quotaService,
                        promptService,
                        redis,
                        objectMapper);
    }

    @Test
    @DisplayName("Should answer with sources and remaining quota")
    void shouldAnswerWithSourcesAndRemainingQuota() {
        when(redis.opsForList()).thenReturn(listOperations);
        when(listOperations.range(anyString(), eq(0L), eq(-1L))).thenReturn(List.of());

        KnowledgeMatch match =
                new KnowledgeMatch(
                        "recruiter_flows.md",
                        "How to Verify Your Company (Company Verification Process)",
                        "Step 1: Verify phone number...",
                        0.92);
        when(knowledgeBaseService.retrieve(anyString(), anyInt(), anyDouble()))
                .thenReturn(List.of(match));

        PromptTemplate prompt =
                new PromptTemplate("support-chatbot.v1", 1, "You are the support assistant.");
        when(promptService.load("support-chatbot", 1)).thenReturn(prompt);

        AiChatResult mockResult =
                new AiChatResult(
                        "To verify your company, follow the 5 verification steps...",
                        List.of(),
                        AiStopReason.END_TURN,
                        new AiUsage(100, 50),
                        "gemini-3.8-flash",
                        null);
        when(aiGatewayService.chat(any(AiCallContext.class), any(AiChatRequest.class)))
                .thenReturn(mockResult);

        when(quotaService.getRemaining(eq(1L), anyString())).thenReturn(29);

        UserChatRequest request = new UserChatRequest("How do I verify my company?", "session-abc");
        UserChatResponse response = service.chat(1L, "127.0.0.1", request);

        assertThat(response.answer()).contains("To verify your company");
        assertThat(response.sources())
                .containsExactly(
                        "recruiter_flows.md - How to Verify Your Company (Company Verification Process)");
        assertThat(response.remainingQuota()).isEqualTo(29);
    }

    @Test
    @DisplayName("Should enforce 429 when quota limit is exceeded")
    void shouldThrow429WhenQuotaExceeded() {
        when(redis.opsForList()).thenReturn(listOperations);
        when(listOperations.range(anyString(), eq(0L), eq(-1L))).thenReturn(List.of());
        when(knowledgeBaseService.retrieve(anyString(), anyInt(), anyDouble()))
                .thenReturn(List.of());
        when(promptService.load("support-chatbot", 1))
                .thenReturn(new PromptTemplate("support-chatbot.v1", 1, "System prompt"));

        when(aiGatewayService.chat(any(AiCallContext.class), any(AiChatRequest.class)))
                .thenThrow(AppException.rateLimited(ErrorCode.AI_IP_QUOTA_EXCEEDED, 3600));

        UserChatRequest request = new UserChatRequest("Hello", "sess-123");

        assertThatThrownBy(() -> service.chat(null, "127.0.0.1", request))
                .isInstanceOf(AppException.class)
                .satisfies(
                        ex -> {
                            AppException appEx = (AppException) ex;
                            assertThat(appEx.getErrorCode().getStatus())
                                    .isEqualTo(HttpStatus.TOO_MANY_REQUESTS);
                            assertThat(appEx.getRetryAfterSeconds()).isEqualTo(3600);
                        });
    }

    @Test
    @DisplayName("Verify that no CV or application data is reachable by AiChatService")
    void verifyNoCvOrApplicationDataReachable() {
        Field[] fields = AiChatService.class.getDeclaredFields();
        for (Field field : fields) {
            String typeName = field.getType().getName().toLowerCase();
            assertThat(typeName)
                    .doesNotContain("cv")
                    .doesNotContain("application")
                    .doesNotContain("candidate");
        }
    }
}
