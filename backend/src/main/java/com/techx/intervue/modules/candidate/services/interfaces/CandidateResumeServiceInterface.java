package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.resources.CandidateResumeResource;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface CandidateResumeServiceInterface {

    record ResumeContent(String fileName, String contentType, byte[] bytes) {}

    record ResumeSnapshot(
            String storagePublicId, String fileName, String contentType, long fileSizeBytes) {}

    List<CandidateResumeResource> findAll(Long userId);

    CandidateResumeResource upload(MultipartFile file, Long userId);

    CandidateResumeResource rename(Long resumeId, String fileName, Long userId);

    CandidateResumeResource setDefault(Long resumeId, Long userId);

    void delete(Long resumeId, Long userId);

    ResumeContent download(Long resumeId, Long userId);

    ResumeSnapshot copyForApplication(Long resumeId, Long userId, String folder);
}
