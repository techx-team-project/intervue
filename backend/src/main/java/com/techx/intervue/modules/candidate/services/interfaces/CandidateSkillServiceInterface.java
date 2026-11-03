package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.requests.SaveCandidateSkillRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;

public interface CandidateSkillServiceInterface {

    CandidateProfileResource create(SaveCandidateSkillRequest request, Long userId);

    CandidateProfileResource update(Long id, SaveCandidateSkillRequest request, Long userId);

    CandidateProfileResource delete(Long id, Long userId);
}
