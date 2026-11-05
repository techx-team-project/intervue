package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.requests.SaveCandidateExperienceRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;

public interface CandidateExperienceServiceInterface {

    CandidateProfileResource create(SaveCandidateExperienceRequest request, Long userId);

    CandidateProfileResource update(Long id, SaveCandidateExperienceRequest request, Long userId);

    CandidateProfileResource delete(Long id, Long userId);
}
