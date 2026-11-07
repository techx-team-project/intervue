package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.common.text.Texts;
import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.enums.RecruiterStatus;
import com.techx.intervue.modules.recruiter.events.RecruiterEmailVerificationRequestedEvent;
import com.techx.intervue.modules.recruiter.mappers.RecruiterMapper;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.requests.RecruiterRegisterRequest;
import com.techx.intervue.modules.recruiter.resources.RecruiterAuthResult;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterAuthServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterRefreshTokenServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterRefreshTokenServiceInterface.IssuedToken;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterRefreshTokenServiceInterface.RefreshResult;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterSessionCacheInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterTwoFactorServiceInterface;
import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.services.interfaces.JwtServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.LoginAttemptServiceInterface;
import com.techx.intervue.services.interfaces.BlacklistServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RecruiterAuthService implements RecruiterAuthServiceInterface {

    private static final String DUMMY_PASSWORD_HASH =
            "$2a$10$eM4EXOxqLsBgw6Tq.SA/4uIAlNcwCwXwH.1Pk/0NXTeaEo7AyQ82O";
    private static final String ATTEMPT_KEY_PREFIX = "recruiter:";

    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;
    private final RecruiterMapper recruiterMapper;
    private final RecruiterRefreshTokenServiceInterface refreshTokenService;
    private final RecruiterSessionCacheInterface sessionCache;
    private final RecruiterTwoFactorServiceInterface recruiterTwoFactorService;
    private final LoginAttemptServiceInterface loginAttemptService;
    private final JwtServiceInterface jwtService;
    private final BlacklistServiceInterface blacklistService;
    private final AuthConfig authConfig;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public RecruiterAuthResult register(
            RecruiterRegisterRequest request, String userAgent, String ip) {
        String email = EmailHelper.normalize(request.email());
        if (!request.password().equals(request.confirmPassword())) {
            throw AppException.validation("confirmPassword", "Confirm password does not match!");
        }
        if (request.password().equalsIgnoreCase(email)) {
            throw AppException.validation(
                    "password", "Password must not be the same as the email!");
        }
        if (recruiterRepository.existsByEmail(email)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
        }

        Recruiter saved =
                recruiterRepository.save(
                        Recruiter.builder()
                                .name(request.name().trim())
                                .email(email)
                                .password(passwordEncoder.encode(request.password()))
                                .gender(request.gender())
                                .companyName(Texts.blankToNull(request.companyName()))
                                .province(Texts.blankToNull(request.province()))
                                .districtWard(Texts.blankToNull(request.districtWard()))
                                .termsAcceptedAt(Instant.now())
                                .build());
        eventPublisher.publishEvent(
                new RecruiterEmailVerificationRequestedEvent(
                        saved.getId(), saved.getEmail(), saved.getName()));
        return openSession(saved, userAgent, ip);
    }

    @Override
    @Transactional
    public RecruiterAuthResult login(
            LoginRequest request, String userAgent, String ip, String rawDeviceToken) {
        String email = EmailHelper.normalize(request.email());
        String attemptKey = ATTEMPT_KEY_PREFIX + email;
        Recruiter recruiter = recruiterRepository.findByEmail(email).orElse(null);

        // Constant-cost comparison so response time does not reveal whether the email exists
        boolean hasPassword = recruiter != null && recruiter.getPassword() != null;
        String hash = hasPassword ? recruiter.getPassword() : DUMMY_PASSWORD_HASH;
        boolean passwordMatches = passwordEncoder.matches(request.password(), hash);
        if (!hasPassword || !passwordMatches) {
            loginAttemptService.recordFailure(attemptKey, ip);
            throw AppException.invalidCredentials(
                    loginAttemptService.isCaptchaRequired(attemptKey, ip));
        }

        loginAttemptService.reset(attemptKey, ip);
        return completeSignIn(recruiter, userAgent, ip, rawDeviceToken);
    }

    @Override
    @Transactional
    public RecruiterAuthResult completeSignIn(
            Recruiter recruiter, String userAgent, String ip, String rawDeviceToken) {
        ensureSignInAllowed(recruiter);

        if (recruiterTwoFactorService.isTwoFactorEnabled(recruiter.getId())) {
            if (rawDeviceToken != null
                    && recruiterTwoFactorService.isDeviceTrusted(
                            recruiter.getId(), rawDeviceToken)) {
                log.info(
                        "Recruiter {} bypassed 2FA challenge via trusted device",
                        recruiter.getId());
                RecruiterAuthResult result = openSession(recruiter, userAgent, ip);
                recruiterRepository.touchLastLogin(recruiter.getId(), Instant.now());
                return result;
            }

            String tempToken =
                    jwtService.generateTwoFactorTempToken(recruiter.getId(), AccountType.RECRUITER);
            return RecruiterAuthResult.challenge(tempToken);
        }

        RecruiterAuthResult result = openSession(recruiter, userAgent, ip);
        recruiterRepository.touchLastLogin(recruiter.getId(), Instant.now());
        return result;
    }

    @Override
    @Transactional
    public RecruiterAuthResult verifyTwoFactor(
            com.techx.intervue.modules.user.requests.TwoFactorChallengeRequest request,
            String userAgent,
            String ip) {
        Long recruiterId;
        try {
            String purpose =
                    jwtService.extractAllClaims(request.tempToken()).get("purp", String.class);
            if (!"2FA_PREAUTH".equals(purpose)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            recruiterId = jwtService.extractSubject(request.tempToken());
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        if (!recruiterTwoFactorService.verifyCodeOrRecoveryCode(recruiterId, request.code())) {
            throw AppException.validation("code", "Invalid verification code or recovery code!");
        }

        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        ensureSignInAllowed(recruiter);

        String deviceTrustToken = null;
        if (Boolean.TRUE.equals(request.trustDevice())) {
            deviceTrustToken =
                    recruiterTwoFactorService.registerTrustedDevice(
                            recruiter.getId(), userAgent, ip);
        }

        RecruiterAuthResult session = openSession(recruiter, userAgent, ip);
        recruiterRepository.touchLastLogin(recruiter.getId(), Instant.now());
        return new RecruiterAuthResult(
                session.accessToken(),
                session.refreshToken(),
                session.recruiter(),
                deviceTrustToken);
    }

    @Override
    @Transactional
    public RecruiterAuthResult refresh(String refreshToken, String userAgent, String ip) {
        RefreshResult rotated = refreshTokenService.rotate(refreshToken, userAgent, ip);
        Recruiter recruiter =
                recruiterRepository
                        .findById(rotated.recruiterId())
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        ensureSignInAllowed(recruiter);
        return new RecruiterAuthResult(
                grantAccess(recruiter),
                rotated.newRefreshToken(),
                recruiterMapper.toResource(recruiter));
    }

    @Override
    public void logout(String accessToken, String refreshToken) {
        Map<String, Object> revocation = jwtService.extractRevoke(accessToken);
        blacklistService.revoke(
                (String) revocation.get("jti"), (Instant) revocation.get("expiresAt"));
        sessionCache.evict(jwtService.extractSubject(accessToken));
        if (refreshToken != null) {
            revokeRefreshToken(refreshToken);
        }
    }

    private void revokeRefreshToken(String refreshToken) {
        try {
            refreshTokenService.revoke(refreshToken);
        } catch (AppException e) {
            log.warn("Recruiter refresh token was already invalid during logout");
        }
    }

    private void ensureSignInAllowed(Recruiter recruiter) {
        if (recruiter.getStatus() == RecruiterStatus.SUSPENDED) {
            throw new AppException(ErrorCode.ACCOUNT_BANNED);
        }
        if (recruiter.getStatus() == RecruiterStatus.PENDING_DELETION) {
            Instant requestedAt = recruiter.getDeleteRequestedAt();
            if (requestedAt != null
                    && Instant.now().isBefore(requestedAt.plus(7, ChronoUnit.DAYS))) {
                recruiter.setStatus(RecruiterStatus.ACTIVE);
                recruiter.setDeleteRequestedAt(null);
                recruiterRepository.save(recruiter);
                return;
            }
            throw new AppException(ErrorCode.ACCOUNT_DELETED);
        }
        if (recruiter.getStatus() == RecruiterStatus.DELETED) {
            throw new AppException(ErrorCode.ACCOUNT_DELETED);
        }
    }

    private RecruiterAuthResult openSession(Recruiter recruiter, String userAgent, String ip) {
        String accessToken = grantAccess(recruiter);
        IssuedToken refreshToken = refreshTokenService.issue(recruiter.getId(), userAgent, ip);
        return new RecruiterAuthResult(
                accessToken, refreshToken.rawToken(), recruiterMapper.toResource(recruiter));
    }

    private String grantAccess(Recruiter recruiter) {
        int tokenVersion = recruiter.getTokenVersion() != null ? recruiter.getTokenVersion() : 1;
        sessionCache.set(
                recruiter.getId(),
                recruiter.getEmail(),
                tokenVersion,
                Duration.ofMillis(authConfig.getExpirationTime()));
        return jwtService.generateToken(recruiter.getId(), AccountType.RECRUITER, tokenVersion);
    }
}
