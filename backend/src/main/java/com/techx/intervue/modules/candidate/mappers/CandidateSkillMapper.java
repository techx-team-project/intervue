package com.techx.intervue.modules.candidate.mappers;

import com.techx.intervue.modules.candidate.entities.CandidateSkill;
import com.techx.intervue.modules.candidate.requests.SaveCandidateSkillRequest;
import com.techx.intervue.modules.candidate.resources.CandidateSkillResource;
import org.springframework.stereotype.Component;

@Component
public class CandidateSkillMapper {

    public void apply(CandidateSkill skill, SaveCandidateSkillRequest request) {
        skill.setName(request.name().trim());
        skill.setCategory(request.category());
        skill.setLevel(request.level());
        skill.setYears(request.years().byteValue());
    }

    public CandidateSkillResource toResource(CandidateSkill skill) {
        return CandidateSkillResource.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .level(skill.getLevel())
                .years(skill.getYears())
                .build();
    }
}
