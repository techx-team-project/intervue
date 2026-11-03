package com.techx.intervue.modules.candidate.events;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.common.storage.StorageTarget;
import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.user.events.UserPurgedEvent;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.support.TransactionTemplate;

@Component
@RequiredArgsConstructor
@Slf4j
public class CandidateProfilePurgeListener {

    private final CandidateProfileRepository profileRepository;
    private final StorageServiceInterface storageService;
    private final TransactionTemplate transactionTemplate;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onUserPurged(UserPurgedEvent event) {
        List<String> publicIds =
                transactionTemplate.execute(status -> deleteProfile(event.userId()));
        if (publicIds != null) {
            publicIds.forEach(this::deleteQuietly);
        }
    }

    private List<String> deleteProfile(Long userId) {
        return profileRepository
                .findByUserId(userId)
                .map(
                        profile -> {
                            profileRepository.delete(profile);
                            return Stream.of(
                                            profile.getAvatarPublicId(), profile.getCoverPublicId())
                                    .filter(Objects::nonNull)
                                    .toList();
                        })
                .orElse(List.of());
    }

    private void deleteQuietly(String publicId) {
        try {
            storageService.delete(publicId, StorageTarget.IMAGE);
        } catch (RuntimeException e) {
            log.warn("Could not discard stored image {}: {}", publicId, e.getMessage());
        }
    }
}
