package com.techx.intervue.modules.ai.tools;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import java.util.Map;

public interface ChatTool {

    String getName();

    AiToolDefinition getDefinition();

    ToolExecutionResult execute(Long callerUserId, Map<String, Object> arguments);
}
