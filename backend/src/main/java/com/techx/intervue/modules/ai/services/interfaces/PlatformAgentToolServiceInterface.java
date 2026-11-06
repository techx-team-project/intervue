package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import java.util.List;
import java.util.Map;

public interface PlatformAgentToolServiceInterface {

    List<AiToolDefinition> getAvailableTools();

    default ToolExecutionResult execute(String toolName, Map<String, Object> arguments) {
        return execute(toolName, null, arguments);
    }

    ToolExecutionResult execute(String toolName, Long callerUserId, Map<String, Object> arguments);
}
