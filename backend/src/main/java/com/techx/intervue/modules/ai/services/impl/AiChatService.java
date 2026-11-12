package com.techx.intervue.modules.ai.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.AiContentBlock;
import com.techx.intervue.modules.ai.requests.AiRole;
import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.requests.ChatContext;
import com.techx.intervue.modules.ai.requests.UserChatRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.AiStopReason;
import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.resources.UserChatResponse;
import com.techx.intervue.modules.ai.services.interfaces.AiChatServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.AiFaqServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.AiResponseCacheServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.KnowledgeBaseServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PlatformAgentToolServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AiChatService implements AiChatServiceInterface {

    private static final String FEATURE_NAME = "support-chatbot";
    private static final String PROMPT_NAME = "support-chatbot";
    private static final int PROMPT_VERSION = 1;
    private static final String HISTORY_PREFIX = "ai:chat:history:";
    private static final Duration HISTORY_TTL = Duration.ofHours(1);
    private static final int MAX_HISTORY_MESSAGES = 6;
    private static final int TOP_K_CHUNKS = 3;
    private static final double MIN_SCORE_THRESHOLD = 0.60;
    private static final int MAX_AGENT_STEPS = 3;
    private static final double FAQ_SEMANTIC_MATCH_THRESHOLD = 0.88;

    private final AiGatewayServiceInterface aiGatewayService;
    private final KnowledgeBaseServiceInterface knowledgeBaseService;
    private final PromptServiceInterface promptService;
    private final PlatformAgentToolServiceInterface agentToolService;
    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;
    private final AiFaqServiceInterface faqService;
    private final AiResponseCacheServiceInterface responseCache;

    @Autowired
    public AiChatService(
            AiGatewayServiceInterface aiGatewayService,
            KnowledgeBaseServiceInterface knowledgeBaseService,
            PromptServiceInterface promptService,
            PlatformAgentToolServiceInterface agentToolService,
            StringRedisTemplate redis,
            ObjectMapper objectMapper,
            @Nullable AiFaqServiceInterface faqService,
            @Nullable AiResponseCacheServiceInterface responseCache) {
        this.aiGatewayService = aiGatewayService;
        this.knowledgeBaseService = knowledgeBaseService;
        this.promptService = promptService;
        this.agentToolService = agentToolService;
        this.redis = redis;
        this.objectMapper = objectMapper;
        this.faqService = faqService;
        this.responseCache = responseCache;
    }

    public AiChatService(
            AiGatewayServiceInterface aiGatewayService,
            KnowledgeBaseServiceInterface knowledgeBaseService,
            PromptServiceInterface promptService,
            PlatformAgentToolServiceInterface agentToolService,
            StringRedisTemplate redis,
            ObjectMapper objectMapper) {
        this(
                aiGatewayService,
                knowledgeBaseService,
                promptService,
                agentToolService,
                redis,
                objectMapper,
                null,
                null);
    }

    @Override
    public UserChatResponse chat(Long userId, String ip, UserChatRequest request) {
        String historyKey = buildHistoryKey(userId, ip, request.sessionId());

        if (faqService != null) {
            // Tier 1: Direct FAQ Code Match (From Chip click or explicit faqCode)
            if (request.faqCode() != null && !request.faqCode().isBlank()) {
                var directMatch = faqService.findByCode(request.faqCode());
                if (directMatch.isPresent()) {
                    saveHistory(historyKey, request.message(), directMatch.get().answer());
                    return directMatch.get();
                }
            }

            // Tier 2: Semantic FAQ Match (Cosine similarity >= 0.88 against FAQ index)
            var semanticMatch =
                    faqService.findSemanticMatch(request.message(), FAQ_SEMANTIC_MATCH_THRESHOLD);
            if (semanticMatch.isPresent()) {
                saveHistory(historyKey, request.message(), semanticMatch.get().answer());
                return semanticMatch.get();
            }
        }

        // Tier 2.5: Cross-User Public Response Cache Check
        if (responseCache != null) {
            var cached = responseCache.get(request.message());
            if (cached.isPresent()) {
                saveHistory(historyKey, request.message(), cached.get().answer());
                return cached.get();
            }
        }

        // Tier 3: Full RAG + Agent ReAct loop with Gemini LLM
        List<KnowledgeMatch> matches =
                knowledgeBaseService.retrieve(request.message(), TOP_K_CHUNKS, MIN_SCORE_THRESHOLD);

        Set<String> aggregatedSources = new LinkedHashSet<>();
        matches.stream()
                .map(m -> m.documentName() + " - " + m.heading())
                .forEach(aggregatedSources::add);

        PromptTemplate systemPrompt = promptService.load(PROMPT_NAME, PROMPT_VERSION);

        List<AiChatMessage> messages = new ArrayList<>(loadHistory(historyKey));

        String augmentedUserMessage =
                buildAugmentedUserMessage(matches, request.message(), request.context());
        messages.add(AiChatMessage.user(augmentedUserMessage));

        List<AiToolDefinition> tools = agentToolService.getAvailableTools();

        AiCallContext callContext = new AiCallContext(FEATURE_NAME, userId, ip, false);
        AiChatRequest chatRequest = new AiChatRequest(systemPrompt, messages, tools);
        AiChatResult result = aiGatewayService.chat(callContext, chatRequest);

        int steps = 0;
        int totalToolCalls = 0;
        final int maxToolCalls = 3;
        boolean calledPrivateTool = false;
        boolean calledJobTool = false;

        while (steps < MAX_AGENT_STEPS
                && totalToolCalls < maxToolCalls
                && result.stopReason() == AiStopReason.TOOL_USE
                && !result.toolCalls().isEmpty()) {
            steps++;
            messages.add(result.assistantMessage());

            List<AiContentBlock.ToolResult> toolResults = new ArrayList<>();
            for (AiContentBlock.ToolUse call : result.toolCalls()) {
                if ("get_my_applications".equals(call.name())
                        || "match_my_cv".equals(call.name())
                        || "draft_cover_letter".equals(call.name())) {
                    calledPrivateTool = true;
                }
                if ("search_jobs".equals(call.name())) {
                    calledJobTool = true;
                }

                if (totalToolCalls >= maxToolCalls) {
                    toolResults.add(
                            new AiContentBlock.ToolResult(
                                    call.id(),
                                    "Đã đạt giới hạn tối đa 3 lần gọi công cụ cho một câu trả lời.",
                                    true));
                    continue;
                }
                totalToolCalls++;
                ToolExecutionResult execResult =
                        agentToolService.execute(call.name(), userId, call.input());
                if (!execResult.sources().isEmpty()) {
                    aggregatedSources.addAll(execResult.sources());
                }
                toolResults.add(
                        new AiContentBlock.ToolResult(
                                call.id(), execResult.content(), execResult.error()));
            }

            messages.add(AiChatMessage.toolResults(toolResults));

            AiChatRequest followUpRequest = new AiChatRequest(systemPrompt, messages, tools);
            result = aiGatewayService.chat(callContext, followUpRequest);
        }

        saveHistory(historyKey, request.message(), result.text());

        UserChatResponse finalResponse =
                new UserChatResponse(result.text(), new ArrayList<>(aggregatedSources));

        if (responseCache != null && !calledPrivateTool) {
            responseCache.put(request.message(), finalResponse, false, calledJobTool);
        }

        return finalResponse;
    }

    private String buildAugmentedUserMessage(
            List<KnowledgeMatch> matches, String userMessage, @Nullable ChatContext context) {
        StringBuilder builder = new StringBuilder();

        if (context != null) {
            builder.append("<current_page_context>\n");
            if (context.pageType() != null) {
                builder.append("Page: ").append(context.pageType()).append("\n");
            }
            if (context.entityId() != null) {
                builder.append("Entity ID: ").append(context.entityId()).append("\n");
            }
            if (context.jobTitle() != null) {
                builder.append("Job Title: ").append(context.jobTitle()).append("\n");
            }
            if (context.companyName() != null) {
                builder.append("Company Name: ").append(context.companyName()).append("\n");
            }
            builder.append("</current_page_context>\n\n");
        }

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
            return HISTORY_PREFIX + "session:" + sessionId;
        }
        return HISTORY_PREFIX + "ip:" + ip;
    }

    public record HistoryEntry(String role, String text) {}
}
