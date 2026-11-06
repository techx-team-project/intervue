package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeSnapshot;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CvSnapshotService {

    private static final String SNAPSHOT_FOLDER = "applications/cv";

    private final CandidateResumeServiceInterface resumeService;
    private final StorageServiceInterface storageService;

    public ResumeSnapshot copy(Long resumeId, Long candidateId) {
        return resumeService.copyForApplication(resumeId, candidateId, SNAPSHOT_FOLDER);
    }

    public void attach(Application application, ResumeSnapshot snapshot) {
        application.setCvStoragePublicId(snapshot.storagePublicId());
        application.setCvFileName(snapshot.fileName());
        application.setCvContentType(snapshot.contentType());
        application.setCvFileSizeBytes(snapshot.fileSizeBytes());
    }

    public ResumeContent read(Application application) {
        byte[] bytes =
                storageService.fetchDocument(
                        application.getCvStoragePublicId(), StorageTarget.RESUME);
        return new ResumeContent(
                application.getCvFileName(), application.getCvContentType(), bytes);
    }

    public void discard(String storagePublicId) {
        if (storagePublicId == null) {
            return;
        }
        try {
            storageService.delete(storagePublicId, StorageTarget.RESUME);
        } catch (RuntimeException e) {
            log.warn("Could not discard CV copy {}: {}", storagePublicId, e.getMessage());
        }
    }
}
