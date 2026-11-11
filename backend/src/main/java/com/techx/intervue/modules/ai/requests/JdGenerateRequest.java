package com.techx.intervue.modules.ai.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record JdGenerateRequest(
        @NotBlank @Size(max = 150) String title,
        @Size(max = 40) String level,
        @Size(max = 40) String contractType,
        @Size(max = 40) String workingArrangement,
        @Size(max = 100) String city,
        @Size(max = 20) List<@NotBlank @Size(max = 80) String> skills,
        @Size(max = 10) String language,
        @Size(max = 1000) String notes) {}
