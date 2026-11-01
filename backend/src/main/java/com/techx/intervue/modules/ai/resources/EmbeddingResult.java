package com.techx.intervue.modules.ai.resources;

import java.util.List;

public record EmbeddingResult(List<float[]> vectors, AiUsage usage, String model) {}
