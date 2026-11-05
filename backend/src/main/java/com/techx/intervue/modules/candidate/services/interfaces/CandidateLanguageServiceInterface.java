package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.requests.SaveCandidateLanguageRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;

public interface CandidateLanguageServiceInterface {

    CandidateProfileResource create(SaveCandidateLanguageRequest request, Long userId);

    CandidateProfileResource update(Long id, SaveCandidateLanguageRequest request, Long userId);

    CandidateProfileResource delete(Long id, Long userId);
}
