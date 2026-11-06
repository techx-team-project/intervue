package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.job.enums.SkillGroup;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SaveSkillRequest(@NotBlank @Size(max = 80) String name, @NotNull SkillGroup group) {}
