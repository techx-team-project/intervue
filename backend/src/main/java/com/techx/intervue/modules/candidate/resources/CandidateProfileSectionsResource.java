package com.techx.intervue.modules.candidate.resources;

import java.util.List;

public record CandidateProfileSectionsResource(
        List<CandidateExperienceResource> experiences,
        List<CandidateEducationResource> educations,
        List<CandidateProjectResource> projects,
        List<CandidateCertificationResource> certifications,
        List<CandidateLanguageResource> languages,
        List<CandidateSkillResource> skills) {

    public static CandidateProfileSectionsResource empty() {
        return new CandidateProfileSectionsResource(
                List.of(), List.of(), List.of(), List.of(), List.of(), List.of());
    }
}
