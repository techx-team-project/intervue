package com.techx.intervue.modules.ai.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.AiContentBlock;
import com.techx.intervue.modules.ai.requests.AiRole;
import com.techx.intervue.modules.ai.requests.UserChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.resources.UserChatResponse;
import com.techx.intervue.modules.ai.services.interfaces.AiChatServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.AiQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.KnowledgeBaseServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiChatService implements AiChatServiceInterface {

    private static final String FEATURE_NAME = "support-chatbot";
    private static final String PROMPT_NAME = "support-chatbot";
    private static final int PROMPT_VERSION = 1;
    private static final String HISTORY_PREFIX = "ai:chat:history:";
    private static final Duration HISTORY_TTL = Duration.ofHours(1);
    private static final int MAX_HISTORY_MESSAGES = 6;
    private static final int TOP_K_CHUNKS = 3;
    private static final double MIN_SCORE_THRESHOLD = 0.60;

    private final AiGatewayServiceInterface aiGatewayService;
    private final KnowledgeBaseServiceInterface knowledgeBaseService;
    private final AiQuotaServiceInterface quotaService;
    private final PromptServiceInterface promptService;
    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    @Override
    public UserChatResponse chat(Long userId, String ip, UserChatRequest request) {
        String historyKey = buildHistoryKey(userId, ip, request.sessionId());

        List<KnowledgeMatch> matches =
                knowledgeBaseService.retrieve(request.message(), TOP_K_CHUNKS, MIN_SCORE_THRESHOLD);

        List<String> sources =
                matches.stream()
                        .map(m -> m.documentName() + " - " + m.heading())
                        .distinct()
                        .toList();

        PromptTemplate systemPrompt = promptService.load(PROMPT_NAME, PROMPT_VERSION);

        List<AiChatMessage> messages = new ArrayList<>(loadHistory(historyKey));

        String augmentedUserMessage = buildAugmentedUserMessage(matches, request.message());
        messages.add(AiChatMessage.user(augmentedUserMessage));

        AiCallContext callContext = new AiCallContext(FEATURE_NAME, userId, ip);
        AiChatRequest chatRequest = new AiChatRequest(systemPrompt, messages, List.of());
        AiChatResult result = aiGatewayService.chat(callContext, chatRequest);

        saveHistory(historyKey, request.message(), result.text());

        int remainingQuota = quotaService.getRemaining(userId, ip);

        return new UserChatResponse(result.text(), sources, remainingQuota);
    }

    private String buildAugmentedUserMessage(List<KnowledgeMatch> matches, String userMessage) {
        StringBuilder builder = new StringBuilder();
        if (!matches.isEmpty()) {
            builder.append("<platform_knowledge>\n");
            for (KnowledgeMatch match : matches) {
                builder.append("--- SOURCE: ")
                        .append(match.documentName())
                        .append(" - ")
                        .append(match.heading())
                        .append(" ---\n")
                        .append(match.content())
                        .append("\n\n");
            }
            builder.append("</platform_knowledge>\n\n");
        }
        builder.append(UntrustedContent.wrap("user_message", userMessage));
        return builder.toString();
    }

    private List<AiChatMessage> loadHistory(String historyKey) {
        try {
            List<String> raw = redis.opsForList().range(historyKey, 0, -1);
            if (raw == null || raw.isEmpty()) {
                return List.of();
            }
            List<AiChatMessage> messages = new ArrayList<>();
            for (String item : raw) {
                HistoryEntry entry = objectMapper.readValue(item, HistoryEntry.class);
                AiRole role =
                        "model".equalsIgnoreCase(entry.role()) ? AiRole.ASSISTANT : AiRole.USER;
                messages.add(
                        new AiChatMessage(
                                role, List.of(new AiContentBlock.Text(entry.text())), null));
            }
            return messages;
        } catch (Exception ex) {
            log.warn("Failed to load chat history from Redis: {}", ex.getMessage());
            return List.of();
        }
    }

    private void saveHistory(String historyKey, String userMessage, String assistantResponse) {
        try {
            String userJson =
                    objectMapper.writeValueAsString(new HistoryEntry("user", userMessage));
            String modelJson =
                    objectMapper.writeValueAsString(new HistoryEntry("model", assistantResponse));

            redis.opsForList().rightPushAll(historyKey, userJson, modelJson);
            redis.opsForList().trim(historyKey, -MAX_HISTORY_MESSAGES, -1);
            redis.expire(historyKey, HISTORY_TTL);
        } catch (JsonProcessingException ex) {
            log.warn("Failed to serialize chat history for Redis: {}", ex.getMessage());
        } catch (Exception ex) {
            log.warn("Failed to save chat history to Redis: {}", ex.getMessage());
        }
    }

    private String buildHistoryKey(Long userId, String ip, String sessionId) {
        if (userId != null) {
            return HISTORY_PREFIX + "user:" + userId;
        }
        if (sessionId != null && !sessionId.isBlank()) {
            return HISTORY_PREFIX + "session:" + sessionId.trim();
        }
        return HISTORY_PREFIX + "ip:" + (ip != null ? ip : "unknown");
    }

    private record HistoryEntry(String role, String text) {}
}
