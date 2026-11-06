package com.techx.intervue.modules.ai.resources;

import lombok.Builder;

@Builder
public record CoverLetterGenerateResult(
        String coverLetter, String modelVersion, String promptVersion, String notice) {}
