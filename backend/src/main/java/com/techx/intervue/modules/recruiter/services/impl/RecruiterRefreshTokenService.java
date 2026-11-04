package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.common.device.DeviceLabelResolver;
import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.recruiter.entities.RecruiterRefreshToken;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRefreshTokenRepository;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterRefreshTokenServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterSessionCacheInterface;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecruiterRefreshTokenService implements RecruiterRefreshTokenServiceInterface {

    private final RecruiterRefreshTokenRepository repository;
    private final RecruiterSessionCacheInterface sessionCache;
    private final AuthConfig authConfig;
    private final TokenHashUtil tokenHashUtil;

    @Override
    @Transactional
    public IssuedToken issue(Long recruiterId, String userAgent, String ip) {
        String rawToken = UUID.randomUUID().toString();
        RecruiterRefreshToken saved =
                repository.save(
                        RecruiterRefreshToken.builder()
                                .recruiterId(recruiterId)
                                .tokenHash(tokenHashUtil.hash(rawToken))
                                .userAgent(userAgent)
                                .ip(ip)
                                .deviceLabel(DeviceLabelResolver.resolve(userAgent))
                                .lastUsedAt(Instant.now())
                                .expiryDate(
                                        Instant.now()
                                                .plus(
                                                        authConfig.getRefreshTokenTTLDays(),
                                                        ChronoUnit.DAYS))
                                .build());
        return new IssuedToken(rawToken, saved.getId());
    }

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public RefreshResult rotate(String rawToken, String userAgent, String ip) {
        RecruiterRefreshToken existing =
                repository
                        .findByTokenHashForUpdate(tokenHashUtil.hash(rawToken))
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        ensureUsable(existing);

        existing.setRevoked(true);
        existing.setRevokedAt(Instant.now());
        existing.setRevokedReason("ROTATED");
        existing.setLastUsedAt(Instant.now());

        IssuedToken next =
                issue(
                        existing.getRecruiterId(),
                        userAgent != null ? userAgent : existing.getUserAgent(),
                        ip != null ? ip : existing.getIp());
        existing.setReplacedByTokenId(next.tokenId());
        repository.save(existing);
        return new RefreshResult(existing.getRecruiterId(), next.rawToken());
    }

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public void revoke(String rawToken) {
        RecruiterRefreshToken existing =
                repository
                        .findByTokenHash(tokenHashUtil.hash(rawToken))
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        ensureUsable(existing);
        existing.setRevoked(true);
        existing.setRevokedAt(Instant.now());
        existing.setRevokedReason("MANUAL_LOGOUT");
        repository.save(existing);
    }

    private void ensureUsable(RecruiterRefreshToken token) {
        if (token.isRevoked() && token.getReplacedByTokenId() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if (token.isRevoked()) {
            repository.revokeAllByRecruiterId(token.getRecruiterId(), Instant.now(), "TOKEN_REUSE");
            sessionCache.evict(token.getRecruiterId());
            log.warn(
                    "Refresh token reuse detected for recruiter {}; all sessions revoked",
                    token.getRecruiterId());
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if (token.getExpiryDate().isBefore(Instant.now())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
