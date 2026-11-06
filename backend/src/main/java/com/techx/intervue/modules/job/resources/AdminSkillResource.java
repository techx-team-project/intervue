package com.techx.intervue.modules.job.resources;

import com.techx.intervue.modules.job.enums.SkillGroup;
import java.time.Instant;
import lombok.Builder;

@Builder
public record AdminSkillResource(
        Long id, String name, SkillGroup group, boolean active, Instant updatedAt) {}
