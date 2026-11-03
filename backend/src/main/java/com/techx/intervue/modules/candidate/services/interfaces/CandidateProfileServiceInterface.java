package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.requests.SaveCandidateProfileRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import org.springframework.web.multipart.MultipartFile;

public interface CandidateProfileServiceInterface {

    CandidateProfileResource getMine(Long userId);

    CandidateProfileResource updateMine(Long userId, SaveCandidateProfileRequest request);

    CandidateProfileResource replaceAvatar(MultipartFile file, Long userId);

    CandidateProfileResource removeAvatar(Long userId);

    CandidateProfileResource replaceCover(MultipartFile file, Long userId);

    CandidateProfileResource removeCover(Long userId);
}
