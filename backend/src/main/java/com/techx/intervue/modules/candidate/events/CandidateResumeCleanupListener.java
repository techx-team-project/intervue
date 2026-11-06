package com.techx.intervue.modules.candidate.events;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class CandidateResumeCleanupListener {

    private final StorageServiceInterface storageService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onResumeDiscarded(CandidateResumeDiscardedEvent event) {
        try {
            storageService.delete(event.publicId(), StorageTarget.RESUME);
        } catch (RuntimeException e) {
            log.warn("Could not discard stored CV {}: {}", event.publicId(), e.getMessage());
        }
    }
}
