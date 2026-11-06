package com.techx.intervue.modules.ai.requests;

import java.util.List;

public record CoverLetterGenerateRequest(
        String jobTitle,
        String companyName,
        List<String> jobRequirements,
        String jobDescription,
        Long resumeId,
        String cvText,
        String candidateName) {}
