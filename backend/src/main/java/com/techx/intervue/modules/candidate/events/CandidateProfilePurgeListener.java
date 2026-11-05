package com.techx.intervue.modules.candidate.events;

import com.techx.intervue.modules.candidate.entities.CandidateCertification;
import com.techx.intervue.modules.candidate.repositories.CandidateCertificationRepository;
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
    private final CandidateCertificationRepository certificationRepository;
    private final ApplicationEventPublisher eventPublisher;

    @EventListener
    public void onUserPurged(UserPurgedEvent event) {
        profileRepository
                .findByUserId(event.userId())
                .ifPresent(
                        profile -> {
                            List<CandidateCertification> certifications =
                                    certificationRepository
                                            .findByCandidateProfileIdOrderByIssueDateDesc(
                                                    profile.getId());
                            profileRepository.delete(profile);
                            List<String> publicIds =
                                    Stream.concat(
                                                    Stream.of(
                                                            profile.getAvatarPublicId(),
                                                            profile.getCoverPublicId()),
                                                    certifications.stream()
                                                            .map(this::imagePublicId))
                                            .filter(Objects::nonNull)
                                            .toList();
                            if (!publicIds.isEmpty()) {
                                eventPublisher.publishEvent(
                                        new CandidateAssetsDiscardedEvent(publicIds));
                            }
                        });
    }

    private String imagePublicId(CandidateCertification certification) {
        return certification.getImagePublicId();
    }
}
