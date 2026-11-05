package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.requests.SaveCandidateCertificationRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import org.springframework.web.multipart.MultipartFile;

public interface CandidateCertificationServiceInterface {

    CandidateProfileResource create(SaveCandidateCertificationRequest request, Long userId);

    CandidateProfileResource update(
            Long id, SaveCandidateCertificationRequest request, Long userId);

    CandidateProfileResource delete(Long id, Long userId);

    CandidateProfileResource replaceImage(Long id, MultipartFile file, Long userId);

    CandidateProfileResource removeImage(Long id, Long userId);
}
