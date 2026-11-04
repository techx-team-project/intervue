package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.requests.SaveCandidateEducationRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;

public interface CandidateEducationServiceInterface {

    CandidateProfileResource create(SaveCandidateEducationRequest request, Long userId);

    CandidateProfileResource update(Long id, SaveCandidateEducationRequest request, Long userId);

    CandidateProfileResource delete(Long id, Long userId);
}
