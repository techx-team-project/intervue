package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.requests.ApplyCvParsedRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.resources.CvParseProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface CandidateCvProfileServiceInterface {

    CvParseProfileResponse parseCv(Long userId, MultipartFile file, Long resumeId, String ip);

    CandidateProfileResource applyParsedData(Long userId, ApplyCvParsedRequest request);
}
