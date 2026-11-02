package com.techx.intervue.modules.ai.requests;

import java.util.List;

public record AiChatMessage(
        AiRole role, List<AiContentBlock> content, ProviderPayload providerPayload) {

    public static AiChatMessage user(String text) {
        return new AiChatMessage(AiRole.USER, List.of(new AiContentBlock.Text(text)), null);
    }

    public static AiChatMessage toolResults(List<AiContentBlock.ToolResult> results) {
        return new AiChatMessage(AiRole.USER, List.copyOf(results), null);
    }
}
