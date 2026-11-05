package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.entities.RecruiterRefreshToken;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRefreshTokenRepository;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterAccountSecurityServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterSessionCacheInterface;
import com.techx.intervue.modules.user.requests.ChangePasswordRequest;
import com.techx.intervue.modules.user.resources.AccountSessionResource;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterAccountSecurityService implements RecruiterAccountSecurityServiceInterface {

    private static final String PASSWORD_CHANGED_REASON = "PASSWORD_CHANGED";
    private static final String USER_REVOKED_REASON = "USER_REVOKED";
    private static final String CHANGE_PASSWORD_ROUTE = "recruiter-change-password";
    private static final Duration CHANGE_PASSWORD_COOLDOWN = Duration.ofSeconds(1);

    private final RateLimitServiceInterface rateLimitService;
    private final AuthFlowProperties properties;
    private final RecruiterRepository recruiterRepository;
    private final RecruiterRefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final RecruiterSessionCacheInterface sessionCache;
    private final TokenHashUtil tokenHashUtil;

    @Override
    @Transactional
    public void changePassword(
            Long recruiterId, ChangePasswordRequest request, String refreshToken) {
        rateLimitService.enforce(
                CHANGE_PASSWORD_ROUTE,
                "recruiter:" + recruiterId,
                CHANGE_PASSWORD_COOLDOWN,
                properties.loginFailThreshold(),
                properties.loginFailWindow());
        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (!passwordEncoder.matches(request.currentPassword(), recruiter.getPassword())) {
            throw AppException.validation("currentPassword", "Current password is incorrect!");
        }
        if (passwordEncoder.matches(request.password(), recruiter.getPassword())) {
            throw AppException.validation(
                    "password", "New password must be different from the current password!");
        }
        if (!request.password().equals(request.confirmPassword())) {
            throw AppException.validation("confirmPassword", "Confirm password does not match!");
        }
        if (request.password().equalsIgnoreCase(recruiter.getEmail())) {
            throw AppException.validation(
                    "password", "Password must not be the same as the email!");
        }

        recruiter.setPassword(passwordEncoder.encode(request.password()));
        recruiter.setTokenVersion(
                (recruiter.getTokenVersion() != null ? recruiter.getTokenVersion() : 1) + 1);
        recruiterRepository.save(recruiter);
        revokeOthers(
                recruiterId, currentTokenId(recruiterId, refreshToken), PASSWORD_CHANGED_REASON);
        sessionCache.evict(recruiterId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountSessionResource> findSessions(Long recruiterId, String refreshToken) {
        Long currentId = currentTokenId(recruiterId, refreshToken);
        return refreshTokenRepository
                .findByRecruiterIdAndRevokedFalseAndExpiryDateAfterOrderByLastUsedAtDesc(
                        recruiterId, Instant.now())
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
                                        .location(null)
                                        .createdAt(token.getCreatedAt())
                                        .lastUsedAt(token.getLastUsedAt())
                                        .current(token.getId().equals(currentId))
                                        .build())
                .toList();
    }

    @Override
    @Transactional
    public void revokeSession(Long recruiterId, Long sessionId, String refreshToken) {
        RecruiterRefreshToken session =
                refreshTokenRepository
                        .findByIdAndRecruiterId(sessionId, recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        if (session.getId().equals(currentTokenId(recruiterId, refreshToken))) {
            throw AppException.validation("sessionId", "Use log out to end the current session!");
        }
        if (!session.isRevoked()) {
            session.setRevoked(true);
            session.setRevokedAt(Instant.now());
            session.setRevokedReason(USER_REVOKED_REASON);
            refreshTokenRepository.save(session);
            sessionCache.evict(recruiterId);
        }
    }

    @Override
    @Transactional
    public void revokeOtherSessions(Long recruiterId, String refreshToken) {
        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        recruiter.setTokenVersion(
                (recruiter.getTokenVersion() != null ? recruiter.getTokenVersion() : 1) + 1);
        recruiterRepository.save(recruiter);
        revokeOthers(recruiterId, currentTokenId(recruiterId, refreshToken), USER_REVOKED_REASON);
        sessionCache.evict(recruiterId);
    }

    private void revokeOthers(Long recruiterId, Long keepId, String reason) {
        if (keepId == null) {
            refreshTokenRepository.revokeAllByRecruiterId(recruiterId, Instant.now(), reason);
            return;
        }
        refreshTokenRepository.revokeAllByRecruiterIdExcept(
                recruiterId, keepId, Instant.now(), reason);
    }

    private Long currentTokenId(Long recruiterId, String rawToken) {
        if (rawToken == null) {
            return null;
        }
        return refreshTokenRepository
                .findByTokenHash(tokenHashUtil.hash(rawToken))
                .filter(token -> recruiterId.equals(token.getRecruiterId()))
                .filter(token -> !token.isRevoked())
                .filter(token -> token.getExpiryDate().isAfter(Instant.now()))
                .map(token -> token.getId())
                .orElse(null);
    }
}
