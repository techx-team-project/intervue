package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.PlatformAgentToolServiceInterface;
import com.techx.intervue.modules.ai.tools.ChatTool;
import com.techx.intervue.modules.ai.tools.ChatToolRegistryInterface;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformAgentToolService implements PlatformAgentToolServiceInterface {

    public static final String TOOL_SEARCH_JOBS = "search_jobs";
    public static final String TOOL_GET_COMPANY_INFO = "get_company_info";
    public static final String TOOL_GET_MY_APPLICATIONS = "get_my_applications";
    public static final String TOOL_GET_PLATFORM_GUIDE = "get_platform_guide";

    public static final String ALIAS_SEARCH_KNOWLEDGE = "search_knowledge_base";
    public static final String ALIAS_SEARCH_COMPANIES = "search_companies";
    public static final String ALIAS_SUGGEST_NAVIGATION = "suggest_navigation";

    private final ChatToolRegistryInterface toolRegistry;

    @Override
    public List<AiToolDefinition> getAvailableTools() {
        List<String> canonicalOrder =
                List.of(
                        TOOL_SEARCH_JOBS,
                        TOOL_GET_COMPANY_INFO,
                        TOOL_GET_MY_APPLICATIONS,
                        TOOL_GET_PLATFORM_GUIDE);

        List<AiToolDefinition> definitions = new ArrayList<>();
        for (String name : canonicalOrder) {
            toolRegistry.find(name).ifPresent(tool -> definitions.add(tool.getDefinition()));
        }
        for (ChatTool tool : toolRegistry.getAll()) {
            if (!canonicalOrder.contains(tool.getName())) {
                definitions.add(tool.getDefinition());
            }
        }
        return definitions;
    }

    @Override
    public ToolExecutionResult execute(String toolName, Map<String, Object> arguments) {
        return execute(toolName, null, arguments);
    }

    @Override
    public ToolExecutionResult execute(
            String toolName, Long callerUserId, Map<String, Object> arguments) {
        if (toolName == null || toolName.isBlank()) {
            return ToolExecutionResult.error("Tool name must not be null or blank");
        }
        String canonicalName = resolveCanonicalName(toolName.trim());
        Map<String, Object> safeArgs = arguments != null ? arguments : Map.of();

        return toolRegistry
                .find(canonicalName)
                .map(tool -> tool.execute(callerUserId, safeArgs))
                .orElseGet(() -> ToolExecutionResult.error("Unknown tool: " + toolName));
    }

    private String resolveCanonicalName(String name) {
        return switch (name) {
            case ALIAS_SEARCH_KNOWLEDGE, ALIAS_SUGGEST_NAVIGATION -> TOOL_GET_PLATFORM_GUIDE;
            case ALIAS_SEARCH_COMPANIES -> TOOL_GET_COMPANY_INFO;
            default -> name;
        };
    }
}
