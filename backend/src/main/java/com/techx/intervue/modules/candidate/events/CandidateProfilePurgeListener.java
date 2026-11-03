package com.techx.intervue.modules.candidate.events;

import com.techx.intervue.modules.candidate.repositories.CandidateProfileRepository;
import com.techx.intervue.modules.user.events.UserPurgedEvent;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CandidateProfilePurgeListener {

    private final CandidateProfileRepository profileRepository;
    private final ApplicationEventPublisher eventPublisher;

    @EventListener
    public void onUserPurged(UserPurgedEvent event) {
        profileRepository
                .findByUserId(event.userId())
                .ifPresent(
                        profile -> {
                            profileRepository.delete(profile);
                            List<String> publicIds =
                                    Stream.of(
                                                    profile.getAvatarPublicId(),
                                                    profile.getCoverPublicId())
                                            .filter(Objects::nonNull)
                                            .toList();
                            if (!publicIds.isEmpty()) {
                                eventPublisher.publishEvent(
                                        new CandidateAssetsDiscardedEvent(publicIds));
                            }
                        });
    }
}
