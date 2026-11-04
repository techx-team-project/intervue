package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.requests.SaveCandidateProjectRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;

public interface CandidateProjectServiceInterface {

    CandidateProfileResource create(SaveCandidateProjectRequest request, Long userId);

    CandidateProfileResource update(Long id, SaveCandidateProjectRequest request, Long userId);

    CandidateProfileResource delete(Long id, Long userId);
}
