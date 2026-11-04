package com.techx.intervue.modules.candidate.mappers;

import com.techx.intervue.common.text.Texts;
import com.techx.intervue.modules.candidate.entities.CandidateExperience;
import com.techx.intervue.modules.candidate.requests.SaveCandidateExperienceRequest;
import com.techx.intervue.modules.candidate.resources.CandidateExperienceResource;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CandidateExperienceMapper {

    public void apply(CandidateExperience experience, SaveCandidateExperienceRequest request) {
        boolean current = request.current();
        experience.setTitle(request.title().trim());
        experience.setCompanyName(request.companyName().trim());
        experience.setLocation(Texts.blankToNull(request.location()));
        experience.setStartDate(request.startDate());
        experience.setCurrent(current);
        experience.setEndDate(current ? null : request.endDate());
        experience.setDescription(Texts.blankToNull(request.description()));
        experience.setAchievements(Texts.blankToNull(request.achievements()));
    }

    public CandidateExperienceResource toResource(
            CandidateExperience experience, List<String> skills) {
        return CandidateExperienceResource.builder()
                .id(experience.getId())
                .title(experience.getTitle())
                .companyName(experience.getCompanyName())
                .location(experience.getLocation())
                .startDate(experience.getStartDate())
                .endDate(experience.getEndDate())
                .current(experience.isCurrent())
                .description(experience.getDescription())
                .achievements(experience.getAchievements())
                .skills(skills.stream().sorted(String.CASE_INSENSITIVE_ORDER).toList())
                .build();
    }
}
