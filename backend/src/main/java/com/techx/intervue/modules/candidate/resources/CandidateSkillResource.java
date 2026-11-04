package com.techx.intervue.modules.candidate.resources;

import com.techx.intervue.modules.candidate.enums.SkillCategory;
import com.techx.intervue.modules.candidate.enums.SkillLevel;
import lombok.Builder;

@Builder
public record CandidateSkillResource(
        Long id, String name, SkillCategory category, SkillLevel level, int years) {}
