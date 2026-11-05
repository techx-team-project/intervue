package com.techx.intervue.modules.candidate.requests;

import com.techx.intervue.modules.candidate.enums.SkillCategory;
import com.techx.intervue.modules.candidate.enums.SkillLevel;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SaveCandidateSkillRequest(
        @NotBlank @Size(max = 60) String name,
        @NotNull SkillCategory category,
        @NotNull SkillLevel level,
        @NotNull @Min(0) @Max(50) Integer years) {}
