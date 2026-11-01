package com.techx.intervue.modules.ai.resources;

import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiContentBlock;
import java.util.List;

public record AiChatResult(
        String text,
        List<AiContentBlock.ToolUse> toolCalls,
        AiStopReason stopReason,
        AiUsage usage,
        String model,
        AiChatMessage assistantMessage) {}
