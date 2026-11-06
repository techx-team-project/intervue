package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.job.enums.SkillGroup;
import jakarta.validation.constraints.Size;

public record AdminSearchSkillsRequest(
        @Size(max = 80) String q, SkillGroup group, Boolean active) {}
