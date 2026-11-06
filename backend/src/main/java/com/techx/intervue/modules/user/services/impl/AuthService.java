package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.UserStatus;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.repositories.UserRestrictionRepository;
import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.services.interfaces.AuthServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.AuthSessionServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.JwtServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.LoginAttemptServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface.RefreshResult;
import com.techx.intervue.modules.user.services.interfaces.TwoFactorServiceInterface;
import com.techx.intervue.services.interfaces.BlacklistServiceInterface;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService implements AuthServiceInterface {

    private static final String DUMMY_PASSWORD_HASH =
            "$2a$10$eM4EXOxqLsBgw6Tq.SA/4uIAlNcwCwXwH.1Pk/0NXTeaEo7AyQ82O";

    private final UserRepository userRepository;
    private final UserRestrictionRepository userRestrictionRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptServiceInterface loginAttemptService;
    private final AuthSessionServiceInterface authSessionService;
    private final RefreshTokenServiceInterface refreshTokenService;
    private final JwtServiceInterface jwtService;
    private final TwoFactorServiceInterface twoFactorService;
    private final BlacklistServiceInterface blacklistService;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional
    public AuthResult login(LoginRequest request, String ip) {
        return login(request, null, ip);
    }

    @Override
    @Transactional
    public AuthResult login(LoginRequest request, String userAgent, String ip) {
        String email = EmailHelper.normalize(request.email());
        Optional<User> found = userRepository.findByEmailWithRoles(email);

        // Constant-cost comparison so response time does not reveal whether the email exists
        String hash = found.map(User::getPassword).orElse(DUMMY_PASSWORD_HASH);
        boolean passwordMatches = passwordEncoder.matches(request.password(), hash);
        if (found.isEmpty() || !passwordMatches) {
            loginAttemptService.recordFailure(email, ip);
            throw AppException.invalidCredentials(loginAttemptService.isCaptchaRequired(email, ip));
        }

        loginAttemptService.reset(email, ip);
        User user = found.get();
        ensureSignInAllowed(user);

        if (twoFactorService.isTwoFactorEnabled(user.getId())) {
            String tempToken =
                    jwtService.generateTwoFactorTempToken(
                            user.getId(), com.techx.intervue.modules.user.enums.AccountType.USER);
            return AuthResult.challenge(tempToken);
        }

        AuthResult result = authSessionService.open(user, userAgent, ip);
        userRepository.touchLastLogin(user.getId(), Instant.now());
        return result;
    }

    @Override
    @Transactional
    public AuthResult verifyTwoFactor(
            com.techx.intervue.modules.user.requests.TwoFactorChallengeRequest request,
            String userAgent,
            String ip) {
        Long userId;
        try {
            String purpose =
                    jwtService.extractAllClaims(request.tempToken()).get("purp", String.class);
            if (!"2FA_PREAUTH".equals(purpose)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            userId = jwtService.extractSubject(request.tempToken());
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        if (!twoFactorService.verifyCodeOrRecoveryCode(userId, request.code())) {
            throw AppException.validation("code", "Invalid verification code or recovery code!");
        }

        User user =
                userRepository
                        .findByIdWithRoles(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        ensureSignInAllowed(user);

        AuthResult result = authSessionService.open(user, userAgent, ip);
        userRepository.touchLastLogin(user.getId(), Instant.now());
        return result;
    }

    @Override
    @Transactional
    public AuthResult refresh(String refreshToken) {
        return refresh(refreshToken, null, null);
    }

    @Override
    @Transactional
    public AuthResult refresh(String refreshToken, String userAgent, String ip) {
        RefreshResult rotated = refreshTokenService.rotateToken(refreshToken, userAgent, ip);
        User user =
                userRepository
                        .findByIdWithRoles(rotated.userId())
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        ensureSignInAllowed(user);
        return authSessionService.renew(user, rotated.newRefreshToken());
    }

    // users.status is only an indexed projection, so the restriction row decides:
    // one that is still standing and has not expired yet is what blocks the sign-in.
    private void ensureSignInAllowed(User user) {
        if (user.getStatus() == UserStatus.ACTIVE) {
            return;
        }
        if (user.getStatus() == UserStatus.PENDING_DELETION) {
            Instant requestedAt = user.getDeleteRequestedAt();
            if (requestedAt != null
                    && Instant.now().isBefore(requestedAt.plus(7, ChronoUnit.DAYS))) {
                user.setStatus(UserStatus.ACTIVE);
                user.setDeleteRequestedAt(null);
                userRepository.save(user);
                auditLogService.record(
                        AuditEntry.builder()
                                .actorType(AuditActorType.USER)
                                .actorId(user.getId())
                                .actorEmail(user.getEmail())
                                .action(AuditAction.USER_RESTORED)
                                .targetType(AuditTargetType.USER)
                                .targetId(user.getId())
                                .reason(
                                        "User automatically restored upon signing in during 7-day"
                                                + " grace period")
                                .build());
                return;
            }
            throw new AppException(ErrorCode.ACCOUNT_DELETED);
        }
        if (user.getStatus() == UserStatus.DELETED) {
            throw new AppException(ErrorCode.ACCOUNT_DELETED);
        }
        boolean restricted =
                userRestrictionRepository
                        .findFirstByUserIdAndLiftedAtIsNullOrderByCreatedAtDesc(user.getId())
                        .filter(restriction -> !restriction.isExpired())
                        .isPresent();
        if (restricted) {
            throw new AppException(ErrorCode.ACCOUNT_BANNED);
        }
    }

    @Override
    public void logout(String accessToken, String refreshToken) {
        Map<String, Object> revocation = jwtService.extractRevoke(accessToken);
        blacklistService.revoke(
                (String) revocation.get("jti"), (Instant) revocation.get("expiresAt"));
        if (refreshToken != null) {
            revokeRefreshToken(refreshToken);
        }
    }

    private void revokeRefreshToken(String refreshToken) {
        try {
            refreshTokenService.revokeToken(refreshToken);
        } catch (AppException e) {
            log.warn("Refresh token was already invalid during logout");
        }
    }
}
