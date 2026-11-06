package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.entities.RefreshToken;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.events.SecuritySettingChangedEvent;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.requests.ChangePasswordRequest;
import com.techx.intervue.modules.user.resources.AccountSessionResource;
import com.techx.intervue.modules.user.services.interfaces.AccountSecurityServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserSessionCacheInterface;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AccountSecurityService implements AccountSecurityServiceInterface {

    private static final String PASSWORD_CHANGED_REASON = "PASSWORD_CHANGED";
    private static final String USER_REVOKED_REASON = "USER_REVOKED";
    private static final String CHANGE_PASSWORD_ROUTE = "change-password";
    private static final Duration CHANGE_PASSWORD_COOLDOWN = Duration.ofSeconds(1);

    private final RateLimitServiceInterface rateLimitService;
    private final AuthFlowProperties properties;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserSessionCacheInterface userSessionCache;
    private final TokenHashUtil tokenHashUtil;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request, String refreshToken) {
        rateLimitService.enforce(
                CHANGE_PASSWORD_ROUTE,
                "user:" + userId,
                CHANGE_PASSWORD_COOLDOWN,
                properties.loginFailThreshold(),
                properties.loginFailWindow());
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw AppException.validation("currentPassword", "Current password is incorrect!");
        }
        if (passwordEncoder.matches(request.password(), user.getPassword())) {
            throw AppException.validation(
                    "password", "New password must be different from the current password!");
        }
        PasswordPolicy.verify(request.password(), request.confirmPassword(), user.getEmail());

        user.setPassword(passwordEncoder.encode(request.password()));
        user.setTokenVersion((user.getTokenVersion() != null ? user.getTokenVersion() : 1) + 1);
        userRepository.save(user);
        revokeOthers(userId, currentTokenId(userId, refreshToken), PASSWORD_CHANGED_REASON);
        userSessionCache.evict(userId);
        eventPublisher.publishEvent(
                new SecuritySettingChangedEvent(
                        AccountType.USER, userId, "Mật khẩu đăng nhập đã được thay đổi."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountSessionResource> findSessions(Long userId, String refreshToken) {
        Long currentId = currentTokenId(userId, refreshToken);
        return refreshTokenRepository
                .findByUserIdAndRevokedFalseAndExpiryDateAfterOrderByLastUsedAtDesc(
                        userId, Instant.now())
                .stream()
                .map(
                        token ->
                                AccountSessionResource.builder()
                                        .id(token.getId())
                                        .deviceLabel(
                                                token.getDeviceLabel() != null
                                                        ? token.getDeviceLabel()
                                                        : "Unknown Device")
                                        .ipAddress(
                                                token.getIp() != null ? token.getIp() : "Unknown")
                                        .location(token.getLocation())
                                        .createdAt(token.getCreatedAt())
                                        .lastUsedAt(token.getLastUsedAt())
                                        .current(token.getId().equals(currentId))
                                        .build())
                .toList();
    }

    @Override
    @Transactional
    public void revokeSession(Long userId, Long sessionId, String refreshToken) {
        RefreshToken session =
                refreshTokenRepository
                        .findByIdAndUserId(sessionId, userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (session.getId().equals(currentTokenId(userId, refreshToken))) {
            throw AppException.validation("sessionId", "Use log out to end the current session!");
        }
        if (!session.isRevoked()) {
            session.setRevoked(true);
            session.setRevokedAt(Instant.now());
            session.setRevokedReason(USER_REVOKED_REASON);
            refreshTokenRepository.save(session);
            userSessionCache.evict(userId);
        }
    }

    @Override
    @Transactional
    public void revokeOtherSessions(Long userId, String refreshToken) {
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        user.setTokenVersion((user.getTokenVersion() != null ? user.getTokenVersion() : 1) + 1);
        userRepository.save(user);
        revokeOthers(userId, currentTokenId(userId, refreshToken), USER_REVOKED_REASON);
        userSessionCache.evict(userId);
    }

    private void revokeOthers(Long userId, Long keepId, String reason) {
        if (keepId == null) {
            refreshTokenRepository.revokeAllByUserId(userId, Instant.now(), reason);
            return;
        }
        refreshTokenRepository.revokeAllByUserIdExcept(userId, keepId, Instant.now(), reason);
    }

    private Long currentTokenId(Long userId, String rawToken) {
        if (rawToken == null) {
            return null;
        }
        return refreshTokenRepository
                .findByTokenHash(tokenHashUtil.hash(rawToken))
                .filter(token -> userId.equals(token.getUserId()))
                .filter(token -> !token.isRevoked())
                .filter(token -> token.getExpiryDate().isAfter(Instant.now()))
                .map(token -> token.getId())
                .orElse(null);
    }
}
