package com.techx.intervue.modules.ai.clients;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.techx.intervue.config.AiProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.AiContentBlock;
import com.techx.intervue.modules.ai.requests.AiRole;
import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.AiStopReason;
import com.techx.intervue.modules.ai.resources.AiUsage;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class GeminiMessageMapper {

    public GeminiRequest toRequest(AiChatRequest request, AiProperties.Gemini config) {
        GeminiContent systemInstruction = null;
        if (request.system() != null
                && request.system().text() != null
                && !request.system().text().isBlank()) {
            systemInstruction =
                    new GeminiContent(null, List.of(GeminiPart.ofText(request.system().text())));
        }

        List<GeminiContent> contents = request.messages().stream().map(this::toContent).toList();

        List<GeminiTool> tools = null;
        if (request.tools() != null && !request.tools().isEmpty()) {
            List<GeminiFunctionDeclaration> declarations =
                    request.tools().stream().map(this::toFunctionDeclaration).toList();
            tools = List.of(new GeminiTool(declarations));
        }

        GeminiGenerationConfig generationConfig =
                new GeminiGenerationConfig(config.maxTokens(), null);

        return new GeminiRequest(systemInstruction, contents, tools, generationConfig);
    }

    public GeminiContent toContent(AiChatMessage message) {
        if (message.providerPayload() instanceof GeminiMessagePayload payload) {
            return payload.content();
        }
        String role = message.role() == AiRole.ASSISTANT ? "model" : "user";
        List<GeminiPart> parts = message.content().stream().map(this::toPart).toList();
        return new GeminiContent(role, parts);
    }

    private GeminiPart toPart(AiContentBlock block) {
        return switch (block) {
            case AiContentBlock.Text text -> GeminiPart.ofText(text.text());
            case AiContentBlock.ToolUse toolUse ->
                    GeminiPart.ofFunctionCall(toolUse.name(), toolUse.input(), null);
            case AiContentBlock.ToolResult toolResult ->
                    GeminiPart.ofFunctionResponse(
                            toolResult.toolUseId(),
                            Map.of(
                                    "output",
                                    toolResult.content() != null ? toolResult.content() : "",
                                    "error",
                                    toolResult.error()));
        };
    }

    private GeminiFunctionDeclaration toFunctionDeclaration(AiToolDefinition definition) {
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("type", "OBJECT");
        if (definition.properties() != null) {
            parameters.put("properties", definition.properties());
        }
        if (definition.required() != null && !definition.required().isEmpty()) {
            parameters.put("required", definition.required());
        }
        return new GeminiFunctionDeclaration(
                definition.name(), definition.description(), parameters);
    }

    public AiChatResult toResult(GeminiResponse response, String model) {
        if (response == null) {
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }
        if (response.promptFeedback() != null && response.promptFeedback().blockReason() != null) {
            log.warn(
                    "Gemini prompt blocked with reason: {}",
                    response.promptFeedback().blockReason());
            throw new AppException(ErrorCode.AI_REQUEST_REFUSED);
        }
        if (response.candidates() == null || response.candidates().isEmpty()) {
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }
        GeminiCandidate candidate = response.candidates().getFirst();
        if ("SAFETY".equalsIgnoreCase(candidate.finishReason())) {
            log.warn("Gemini candidate refused with finish reason SAFETY");
            throw new AppException(ErrorCode.AI_REQUEST_REFUSED);
        }

        GeminiContent content = candidate.content();
        List<AiContentBlock> blocks = new ArrayList<>();
        if (content != null && content.parts() != null) {
            for (GeminiPart part : content.parts()) {
                if (part.text() != null && !part.text().isEmpty()) {
                    blocks.add(new AiContentBlock.Text(part.text()));
                }
                if (part.functionCall() != null) {
                    blocks.add(
                            new AiContentBlock.ToolUse(
                                    part.functionCall().name(),
                                    part.functionCall().name(),
                                    part.functionCall().args() != null
                                            ? part.functionCall().args()
                                            : Map.of()));
                }
            }
        }

        String text =
                String.join(
                        "",
                        blocks.stream()
                                .filter(AiContentBlock.Text.class::isInstance)
                                .map(block -> ((AiContentBlock.Text) block).text())
                                .toList());

        List<AiContentBlock.ToolUse> toolCalls =
                blocks.stream()
                        .filter(AiContentBlock.ToolUse.class::isInstance)
                        .map(AiContentBlock.ToolUse.class::cast)
                        .toList();

        AiUsage usage =
                response.usageMetadata() != null
                        ? new AiUsage(
                                response.usageMetadata().promptTokenCount(),
                                response.usageMetadata().candidatesTokenCount())
                        : new AiUsage(0, 0);

        AiStopReason stopReason = toStopReason(candidate.finishReason(), !toolCalls.isEmpty());
        GeminiContent rawContent =
                content != null ? content : new GeminiContent("model", List.of());
        AiChatMessage assistantMessage =
                new AiChatMessage(AiRole.ASSISTANT, blocks, new GeminiMessagePayload(rawContent));

        return new AiChatResult(text, toolCalls, stopReason, usage, model, assistantMessage);
    }

    private AiStopReason toStopReason(String finishReason, boolean hasToolCalls) {
        if (hasToolCalls) {
            return AiStopReason.TOOL_USE;
        }
        if (finishReason == null) {
            return AiStopReason.OTHER;
        }
        return switch (finishReason.toUpperCase(Locale.ROOT)) {
            case "STOP" -> AiStopReason.END_TURN;
            case "MAX_TOKENS" -> AiStopReason.MAX_TOKENS;
            default -> AiStopReason.OTHER;
        };
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GeminiRequest(
            @JsonProperty("system_instruction") GeminiContent systemInstruction,
            List<GeminiContent> contents,
            @JsonInclude(JsonInclude.Include.NON_EMPTY) List<GeminiTool> tools,
            @JsonProperty("generationConfig") GeminiGenerationConfig generationConfig) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GeminiContent(String role, List<GeminiPart> parts) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GeminiPart(
            String text,
            @JsonProperty("functionCall") GeminiFunctionCall functionCall,
            @JsonProperty("functionResponse") GeminiFunctionResponse functionResponse,
            @JsonProperty("thoughtSignature") String thoughtSignature) {

        public static GeminiPart ofText(String text) {
            return new GeminiPart(text, null, null, null);
        }

        public static GeminiPart ofFunctionCall(
                String name, Map<String, Object> args, String thoughtSignature) {
            return new GeminiPart(
                    null, new GeminiFunctionCall(name, args, null), null, thoughtSignature);
        }

        public static GeminiPart ofFunctionResponse(String name, Map<String, Object> response) {
            return new GeminiPart(null, null, new GeminiFunctionResponse(name, response), null);
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GeminiFunctionCall(String name, Map<String, Object> args, String id) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GeminiFunctionResponse(String name, Map<String, Object> response) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GeminiTool(
            @JsonProperty("functionDeclarations")
                    List<GeminiFunctionDeclaration> functionDeclarations) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GeminiFunctionDeclaration(
            String name, String description, Map<String, Object> parameters) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record GeminiGenerationConfig(
            @JsonProperty("maxOutputTokens") Integer maxOutputTokens,
            @JsonProperty("temperature") Double temperature) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GeminiResponse(
            List<GeminiCandidate> candidates,
            @JsonProperty("promptFeedback") GeminiPromptFeedback promptFeedback,
            @JsonProperty("usageMetadata") GeminiUsageMetadata usageMetadata) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GeminiCandidate(
            GeminiContent content,
            @JsonProperty("finishReason") String finishReason,
            Integer index) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GeminiPromptFeedback(@JsonProperty("blockReason") String blockReason) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GeminiUsageMetadata(
            @JsonProperty("promptTokenCount") int promptTokenCount,
            @JsonProperty("candidatesTokenCount") int candidatesTokenCount,
            @JsonProperty("totalTokenCount") int totalTokenCount) {}
}
