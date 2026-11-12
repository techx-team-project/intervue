package com.techx.intervue.modules.ai.clients;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OpenAiMessageMapper {

    private static final TypeReference<Map<String, Object>> ARGUMENTS_TYPE =
            new TypeReference<>() {};

    private final ObjectMapper objectMapper;

    public OpenAiRequest toRequest(AiChatRequest request, String model, int maxTokens) {
        List<OpenAiMessage> messages = new ArrayList<>();
        if (request.system() != null
                && request.system().text() != null
                && !request.system().text().isBlank()) {
            messages.add(new OpenAiMessage("developer", request.system().text(), null, null));
        }
        request.messages().forEach(message -> messages.addAll(toMessages(message)));

        List<OpenAiTool> tools =
                request.tools() == null || request.tools().isEmpty()
                        ? null
                        : request.tools().stream().map(this::toTool).toList();
        return new OpenAiRequest(model, messages, tools, maxTokens);
    }

    private List<OpenAiMessage> toMessages(AiChatMessage message) {
        String text = joinText(message.content());
        if (message.role() == AiRole.ASSISTANT) {
            List<OpenAiToolCall> toolCalls =
                    message.content().stream()
                            .filter(AiContentBlock.ToolUse.class::isInstance)
                            .map(AiContentBlock.ToolUse.class::cast)
                            .map(this::toToolCall)
                            .toList();
            return List.of(
                    new OpenAiMessage(
                            "assistant",
                            text.isEmpty() ? null : text,
                            toolCalls.isEmpty() ? null : toolCalls,
                            null));
        }

        List<OpenAiMessage> messages = new ArrayList<>();
        for (AiContentBlock block : message.content()) {
            if (block instanceof AiContentBlock.ToolResult result) {
                String content = result.content() != null ? result.content() : "";
                messages.add(
                        new OpenAiMessage(
                                "tool",
                                result.error() ? "Error: " + content : content,
                                null,
                                result.toolUseId()));
            }
        }
        if (!text.isEmpty()) {
            messages.add(new OpenAiMessage("user", text, null, null));
        }
        return messages;
    }

    private String joinText(List<AiContentBlock> blocks) {
        return String.join(
                "",
                blocks.stream()
                        .filter(AiContentBlock.Text.class::isInstance)
                        .map(block -> ((AiContentBlock.Text) block).text())
                        .toList());
    }

    private OpenAiToolCall toToolCall(AiContentBlock.ToolUse toolUse) {
        try {
            return new OpenAiToolCall(
                    toolUse.id(),
                    "function",
                    new OpenAiFunctionCall(
                            toolUse.name(), objectMapper.writeValueAsString(toolUse.input())));
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Tool arguments are not serializable", ex);
        }
    }

    private OpenAiTool toTool(AiToolDefinition definition) {
        Map<String, Object> parameters = new LinkedHashMap<>();
        parameters.put("type", "object");
        parameters.put(
                "properties",
                definition.properties() != null
                        ? lowerCaseTypes(definition.properties())
                        : Map.of());
        if (definition.required() != null && !definition.required().isEmpty()) {
            parameters.put("required", definition.required());
        }
        return new OpenAiTool(
                "function",
                new OpenAiFunction(definition.name(), definition.description(), parameters));
    }

    // Tool schemas are written with Gemini's upper-case type names; JSON Schema needs lower-case.
    @SuppressWarnings("unchecked")
    private Object lowerCaseTypes(Object node) {
        if (node instanceof Map<?, ?> map) {
            Map<String, Object> converted = new LinkedHashMap<>();
            ((Map<String, Object>) map)
                    .forEach(
                            (key, value) ->
                                    converted.put(
                                            key,
                                            "type".equals(key) && value instanceof String type
                                                    ? type.toLowerCase(Locale.ROOT)
                                                    : lowerCaseTypes(value)));
            return converted;
        }
        if (node instanceof List<?> list) {
            return list.stream().map(this::lowerCaseTypes).toList();
        }
        return node;
    }

    public AiChatResult toResult(OpenAiResponse response, String model) {
        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }
        OpenAiChoice choice = response.choices().getFirst();
        OpenAiResponseMessage message = choice.message();
        if ("content_filter".equals(choice.finishReason())
                || (message != null && message.refusal() != null && !message.refusal().isBlank())) {
            log.warn("OpenAI refused the request with finish reason {}", choice.finishReason());
            throw new AppException(ErrorCode.AI_REQUEST_REFUSED);
        }

        String text = message != null && message.content() != null ? message.content() : "";
        List<AiContentBlock> blocks = new ArrayList<>();
        if (!text.isEmpty()) {
            blocks.add(new AiContentBlock.Text(text));
        }
        List<AiContentBlock.ToolUse> toolCalls = new ArrayList<>();
        if (message != null && message.toolCalls() != null) {
            for (OpenAiToolCall call : message.toolCalls()) {
                AiContentBlock.ToolUse toolUse =
                        new AiContentBlock.ToolUse(
                                call.id(),
                                call.function().name(),
                                parseArguments(call.function().arguments()));
                toolCalls.add(toolUse);
                blocks.add(toolUse);
            }
        }

        AiUsage usage =
                response.usage() != null
                        ? new AiUsage(
                                response.usage().promptTokens(),
                                response.usage().completionTokens())
                        : new AiUsage(0, 0);
        AiChatMessage assistantMessage = new AiChatMessage(AiRole.ASSISTANT, blocks, null);
        return new AiChatResult(
                text,
                toolCalls,
                toStopReason(choice.finishReason(), !toolCalls.isEmpty()),
                usage,
                model,
                assistantMessage);
    }

    private Map<String, Object> parseArguments(String arguments) {
        if (arguments == null || arguments.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(arguments, ARGUMENTS_TYPE);
        } catch (JsonProcessingException ex) {
            log.warn("OpenAI returned tool arguments that are not valid JSON");
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }
    }

    private AiStopReason toStopReason(String finishReason, boolean hasToolCalls) {
        if (hasToolCalls) {
            return AiStopReason.TOOL_USE;
        }
        if (finishReason == null) {
            return AiStopReason.OTHER;
        }
        return switch (finishReason) {
            case "stop" -> AiStopReason.END_TURN;
            case "length" -> AiStopReason.MAX_TOKENS;
            default -> AiStopReason.OTHER;
        };
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record OpenAiRequest(
            String model,
            List<OpenAiMessage> messages,
            @JsonInclude(JsonInclude.Include.NON_EMPTY) List<OpenAiTool> tools,
            @JsonProperty("max_completion_tokens") Integer maxCompletionTokens) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record OpenAiMessage(
            String role,
            String content,
            @JsonProperty("tool_calls") List<OpenAiToolCall> toolCalls,
            @JsonProperty("tool_call_id") String toolCallId) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OpenAiToolCall(String id, String type, OpenAiFunctionCall function) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OpenAiFunctionCall(String name, String arguments) {}

    public record OpenAiTool(String type, OpenAiFunction function) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record OpenAiFunction(String name, String description, Map<String, Object> parameters) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OpenAiResponse(List<OpenAiChoice> choices, OpenAiUsage usage) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OpenAiChoice(
            OpenAiResponseMessage message, @JsonProperty("finish_reason") String finishReason) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OpenAiResponseMessage(
            String content,
            String refusal,
            @JsonProperty("tool_calls") List<OpenAiToolCall> toolCalls) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record OpenAiUsage(
            @JsonProperty("prompt_tokens") int promptTokens,
            @JsonProperty("completion_tokens") int completionTokens) {}
}
