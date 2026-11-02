package com.techx.intervue.modules.ai.requests;

import java.util.List;

public record EmbeddingRequest(List<String> inputs, EmbeddingInputType inputType) {}
