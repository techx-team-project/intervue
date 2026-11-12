package com.techx.intervue.modules.ai.requests;

import java.util.List;

public record AiChatMessage(AiRole role, List<AiContentBlock> content) {

    public static AiChatMessage user(String text) {
        return new AiChatMessage(AiRole.USER, List.of(new AiContentBlock.Text(text)));
    }

    public static AiChatMessage toolResults(List<AiContentBlock.ToolResult> results) {
        return new AiChatMessage(AiRole.USER, List.copyOf(results));
    }
}
