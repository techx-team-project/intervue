package com.techx.intervue.modules.ai.requests;

import java.util.Map;

public sealed interface AiContentBlock {

    record Text(String text) implements AiContentBlock {}

    record ToolUse(String id, String name, Map<String, Object> input) implements AiContentBlock {}

    record ToolResult(String toolUseId, String content, boolean error) implements AiContentBlock {}
}
