package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.device.DeviceLabelResolver;
import com.techx.intervue.common.geolocation.GeoLocationServiceInterface;
import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.entities.RefreshToken;
import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.enums.TokenOrigin;
import com.techx.intervue.modules.user.events.NewDeviceSignInEvent;
import com.techx.intervue.modules.user.events.RefreshTokenLocationResolveEvent;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserSessionCacheInterface;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RefreshTokenService implements RefreshTokenServiceInterface {

    private final RefreshTokenRepository repository;
    private final AuthConfig authConfig;
    private final TokenHashUtil utils;
    private final GeoLocationServiceInterface geoLocationService;
    private final UserSessionCacheInterface userSessionCache;
    private final AuditLogServiceInterface auditLogService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public String generateRefreshTokenRaw() {
        return UUID.randomUUID().toString();
    }

    @Override
    public IssuedToken issueRefreshToken(Long userId) {
        return issueRefreshToken(userId, null, null, TokenOrigin.SIGN_IN);
    }

    @Override
    @Transactional
    public IssuedToken issueRefreshToken(Long userId, String userAgent, String ip) {
        return issueRefreshToken(userId, userAgent, ip, TokenOrigin.SIGN_IN);
    }

    @Override
    @Transactional
    public IssuedToken issueRefreshToken(
            Long userId, String userAgent, String ip, TokenOrigin origin) {
        String token = this.generateRefreshTokenRaw();
        String tokenHash = utils.hash(token);
        String deviceLabel = DeviceLabelResolver.resolve(userAgent);

        String cachedOrLocal = geoLocationService.resolveCachedOrLocalLocation(ip);
        String location = cachedOrLocal != null ? cachedOrLocal : "Unknown Location";

        RefreshToken entity =
                RefreshToken.builder()
                        .tokenHash(tokenHash)
                        .userId(userId)
                        .userAgent(userAgent)
                        .ip(ip)
                        .deviceLabel(deviceLabel)
                        .location(location)
                        .origin(origin != null ? origin : TokenOrigin.SIGN_IN)
                        .lastUsedAt(Instant.now())
                        .expiryDate(
                                Instant.now()
                                        .plus(authConfig.getRefreshTokenTTLDays(), ChronoUnit.DAYS))
                        .revoked(false)
                        .build();
        repository.save(entity);

        if (cachedOrLocal == null && ip != null && !ip.isBlank()) {
            eventPublisher.publishEvent(new RefreshTokenLocationResolveEvent(entity.getId(), ip));
        }
        announceIfNewDevice(entity, deviceLabel, location, ip);

        return new IssuedToken(token, entity.getId());
    }

    // A rotated token keeps the same device label, so only a genuinely unseen device notifies.
    private void announceIfNewDevice(
            RefreshToken issued, String deviceLabel, String location, String ip) {
        if (repository.countByUserIdAndIdNot(issued.getUserId(), issued.getId()) == 0
                || repository.existsByUserIdAndDeviceLabelAndIdNot(
                        issued.getUserId(), deviceLabel, issued.getId())) {
            return;
        }
        eventPublisher.publishEvent(
                NewDeviceSignInEvent.builder()
                        .accountType(AccountType.USER)
                        .accountId(issued.getUserId())
                        .deviceLabel(deviceLabel)
                        .location(location)
                        .ip(ip)
                        .at(Instant.now())
                        .build());
    }

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public RefreshResult rotateToken(String rawToken) {
        return rotateToken(rawToken, null, null);
    }

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public RefreshResult rotateToken(String rawToken, String userAgent, String ip) {
        RefreshToken existing =
                repository
                        .findByTokenHashForUpdate(utils.hash(rawToken))
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        this.checkIsRevoked(existing);
        this.checkExpiryDate(existing);

        String effectiveUa = userAgent != null ? userAgent : existing.getUserAgent();
        String effectiveIp = ip != null ? ip : existing.getIp();

        existing.setRevoked(true);
        existing.setRevokedAt(Instant.now());
        existing.setRevokedReason("ROTATED");
        existing.setLastUsedAt(Instant.now());

        IssuedToken newToken =
                this.issueRefreshToken(
                        existing.getUserId(), effectiveUa, effectiveIp, TokenOrigin.ROTATION);
        existing.setReplacedByTokenId(newToken.tokenId());
        repository.save(existing);
        return new RefreshResult(existing.getUserId(), newToken.rawToken());
    }

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public void revokeToken(String rawToken) {
        RefreshToken existing =
                repository
                        .findByTokenHash(utils.hash(rawToken))
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        this.checkIsRevoked(existing);
        this.checkExpiryDate(existing);
        existing.setRevoked(true);
        existing.setRevokedAt(Instant.now());
        existing.setRevokedReason("MANUAL_LOGOUT");
        repository.save(existing);
    }

    private void checkIsRevoked(RefreshToken entity) {
        if (entity.isRevoked() && entity.getReplacedByTokenId() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if (entity.isRevoked()) {
            repository.revokeAllByUserId(entity.getUserId(), Instant.now(), "TOKEN_REUSE");
            userSessionCache.evict(entity.getUserId());
            log.warn(
                    "Token reuse incident detected for user {}. All sessions revoked.",
                    entity.getUserId());
            auditLogService.record(
                    AuditEntry.builder()
                            .actorType(AuditActorType.SYSTEM)
                            .actorId(null)
                            .actorEmail("system")
                            .action(AuditAction.TOKEN_REUSE_DETECTED)
                            .targetType(AuditTargetType.USER)
                            .targetId(entity.getUserId())
                            .reason(
                                    "Revoked refresh token presented again — every session was"
                                            + " revoked")
                            .detail(null)
                            .ip(entity.getIp())
                            .build());
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private void checkExpiryDate(RefreshToken entity) {
        if (entity.getExpiryDate().isBefore(Instant.now())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
