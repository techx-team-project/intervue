package com.techx.intervue.modules.ai.requests;

import com.techx.intervue.modules.ai.resources.PromptTemplate;
import java.util.List;

public record AiChatRequest(
        PromptTemplate system, List<AiChatMessage> messages, List<AiToolDefinition> tools) {

    public AiChatRequest withSystem(PromptTemplate system) {
        return new AiChatRequest(system, messages, tools);
    }
}
