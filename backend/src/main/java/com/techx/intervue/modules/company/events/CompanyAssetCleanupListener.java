package com.techx.intervue.modules.company.events;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class CompanyAssetCleanupListener {

    private final StorageServiceInterface storageService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onCompanyAssetsDiscarded(CompanyAssetsDiscardedEvent event) {
        for (String publicId : event.publicIds()) {
            try {
                storageService.delete(publicId, StorageTarget.IMAGE);
            } catch (RuntimeException e) {
                log.warn("Could not discard stored image {}: {}", publicId, e.getMessage());
            }
        }
    }
}
