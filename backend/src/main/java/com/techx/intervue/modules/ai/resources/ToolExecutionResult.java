package com.techx.intervue.modules.ai.resources;

import java.util.List;

public record ToolExecutionResult(String content, List<String> sources, boolean error) {

    public static ToolExecutionResult success(String content, List<String> sources) {
        return new ToolExecutionResult(content, sources != null ? sources : List.of(), false);
    }

    public static ToolExecutionResult success(String content) {
        return new ToolExecutionResult(content, List.of(), false);
    }

    public static ToolExecutionResult error(String errorMessage) {
        return new ToolExecutionResult(errorMessage, List.of(), true);
    }
}
