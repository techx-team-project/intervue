package com.techx.intervue.modules.job.mappers;

import com.techx.intervue.modules.job.entities.Skill;
import com.techx.intervue.modules.job.resources.AdminSkillResource;
import com.techx.intervue.modules.job.resources.SkillResource;
import org.springframework.stereotype.Component;

@Component
public class SkillMapper {

    public SkillResource toResource(Skill skill) {
        return new SkillResource(skill.getId(), skill.getName(), skill.getGroup());
    }

    public AdminSkillResource toAdminResource(Skill skill) {
        return AdminSkillResource.builder()
                .id(skill.getId())
                .name(skill.getName())
                .group(skill.getGroup())
                .active(skill.isActive())
                .updatedAt(skill.getUpdatedAt())
                .build();
    }
}
