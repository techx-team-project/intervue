package com.techx.intervue.modules.candidate.mappers;

import com.techx.intervue.modules.candidate.entities.CandidateEducation;
import com.techx.intervue.modules.candidate.requests.SaveCandidateEducationRequest;
import com.techx.intervue.modules.candidate.resources.CandidateEducationResource;
import org.springframework.stereotype.Component;

@Component
public class CandidateEducationMapper {

    public void apply(CandidateEducation education, SaveCandidateEducationRequest request) {
        education.setSchool(request.school().trim());
        education.setDegree(blankToNull(request.degree()));
        education.setMajor(blankToNull(request.major()));
        education.setStartYear(request.startYear().shortValue());
        education.setEndYear(request.endYear() == null ? null : request.endYear().shortValue());
        education.setGpa(blankToNull(request.gpa()));
        education.setAchievements(blankToNull(request.achievements()));
    }

    public CandidateEducationResource toResource(CandidateEducation education) {
        return CandidateEducationResource.builder()
                .id(education.getId())
                .school(education.getSchool())
                .degree(education.getDegree())
                .major(education.getMajor())
                .startYear(education.getStartYear())
                .endYear(education.getEndYear() == null ? null : education.getEndYear().intValue())
                .gpa(education.getGpa())
                .achievements(education.getAchievements())
                .build();
    }

    private String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
