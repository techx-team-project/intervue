package com.techx.intervue.modules.ai.requests;

import java.util.List;
import java.util.Map;

public record AiToolDefinition(
        String name, String description, Map<String, Object> properties, List<String> required) {}
