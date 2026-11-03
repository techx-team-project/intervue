package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CandidateImageCleaner {

    private final StorageServiceInterface storageService;

    public void deleteQuietly(String publicId) {
        if (publicId == null) {
            return;
        }
        try {
            storageService.delete(publicId, StorageTarget.IMAGE);
        } catch (RuntimeException e) {
            log.warn("Could not delete stored image {}: {}", publicId, e.getMessage());
        }
    }
}
