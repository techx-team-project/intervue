package com.techx.intervue.modules.user.listeners;

import com.techx.intervue.common.geolocation.GeoLocationServiceInterface;
import com.techx.intervue.modules.user.events.RefreshTokenLocationResolveEvent;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenLocationListener {

    private final GeoLocationServiceInterface geoLocationService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onRefreshTokenIssued(RefreshTokenLocationResolveEvent event) {
        if (event.ip() == null || event.ip().isBlank()) {
            return;
        }
        try {
            String location = geoLocationService.resolveLocation(event.ip());
            if (location != null && !"Unknown Location".equals(location)) {
                refreshTokenRepository.updateLocation(event.tokenId(), location);
            }
        } catch (Exception e) {
            log.debug(
                    "Async location resolution failed for token {}: {}",
                    event.tokenId(),
                    e.getMessage());
        }
    }
}
