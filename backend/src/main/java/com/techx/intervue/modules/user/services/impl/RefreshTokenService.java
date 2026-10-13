package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.entities.RefreshToken;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@AllArgsConstructor
public class RefreshTokenService implements RefreshTokenServiceInterface {
    private RefreshTokenRepository repository;
    private AuthConfig authConfig;
    private TokenHashUtil utils;

    @Override
    public String generateRefreshTokenRaw() {
        return UUID.randomUUID().toString();
    }

    @Override
    public IssuedToken issueRefreshToken(Long userId) {
        String token = this.generateRefreshTokenRaw();
        String tokenHash = utils.hash(token);
        RefreshToken entity =
                RefreshToken.builder()
                        .tokenHash(tokenHash) // token đã hash
                        .userId(userId)
                        .expiryDate(
                                Instant.now()
                                        .plus(authConfig.getRefreshTokenTTLDays(), ChronoUnit.DAYS))
                        .revoked(false)
                        .build();
        repository.save(entity);

        return new IssuedToken(token, entity.getId());
    }

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public RefreshResult rotateToken(String rawToken) {
        RefreshToken existing =
                repository
                        .findByTokenHashForUpdate(utils.hash(rawToken))
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        this.checkIsRevoked(existing);
        this.checkExpiryDate(existing);
        existing.setRevoked(true);
        IssuedToken newToken = this.issueRefreshToken(existing.getUserId());
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
        repository.save(existing);
    }

    private void checkIsRevoked(RefreshToken entity) {
        if (entity.isRevoked()) {
            // revoked hết tất cả những refresh token của người dùng
            repository.revokeAllRefreshTokenByUser(entity.getUserId());
            log.error(
                    "Phát hiện token bị đánh cắp, đã tiến hành revoke tất cả token của người dùng.");
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private void checkExpiryDate(RefreshToken entity) {
        if (entity.getExpiryDate().isBefore(Instant.now())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }
}
