package com.techx.intervue.modules.ai.resources;

import java.util.List;

public record UserChatResponse(String answer, List<String> sources) {}
