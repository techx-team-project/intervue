package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.enums.DocumentReviewStatus;
import com.techx.intervue.modules.company.repositories.BusinessDocumentRepository;
import com.techx.intervue.modules.company.repositories.CompanyRepository;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.enums.UserStatus;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.requests.TwoFactorChallengeRequest;
import com.techx.intervue.modules.user.resources.AdminAuthResult;
import com.techx.intervue.modules.user.resources.AdminProfileResource;
import com.techx.intervue.modules.user.resources.AdminQueueCountsResource;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;
import com.techx.intervue.modules.user.services.interfaces.AdminAuthServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.AuthSessionServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.JwtServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.LoginAttemptServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface.RefreshResult;
import com.techx.intervue.modules.user.services.interfaces.TwoFactorServiceInterface;
import com.techx.intervue.services.interfaces.BlacklistServiceInterface;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AdminAuthService implements AdminAuthServiceInterface {

    private static final String DUMMY_PASSWORD_HASH =
            "$2a$10$eM4EXOxqLsBgw6Tq.SA/4uIAlNcwCwXwH.1Pk/0NXTeaEo7AyQ82O";
    private static final String ATTEMPT_KEY_PREFIX = "admin:";

    private final UserRepository userRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final BusinessDocumentRepository businessDocumentRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptServiceInterface loginAttemptService;
    private final AuthSessionServiceInterface authSessionService;
    private final RefreshTokenServiceInterface refreshTokenService;
    private final JwtServiceInterface jwtService;
    private final TwoFactorServiceInterface twoFactorService;
    private final BlacklistServiceInterface blacklistService;

    @Override
    @Transactional
    public AdminAuthResult login(LoginRequest request, String userAgent, String ip) {
        String email = EmailHelper.normalize(request.email());
        String attemptKey = ATTEMPT_KEY_PREFIX + email;
        User user = userRepository.findByEmailWithRoles(email).orElse(null);

        String hash = user != null ? user.getPassword() : DUMMY_PASSWORD_HASH;
        boolean passwordMatches = passwordEncoder.matches(request.password(), hash);
        if (user == null || !passwordMatches) {
            loginAttemptService.recordFailure(attemptKey, ip);
            throw AppException.invalidCredentials(
                    loginAttemptService.isCaptchaRequired(attemptKey, ip));
        }

        if (!user.hasRole(RoleType.ADMIN)) {
            log.warn("Non-admin user {} attempted login to Fortress Admin portal", email);
            throw new AppException(ErrorCode.ADMIN_ACCESS_REQUIRED);
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException(ErrorCode.FORBIDDEN);
        }

        loginAttemptService.reset(attemptKey, ip);

        if (twoFactorService.isTwoFactorEnabled(user.getId())) {
            String tempToken =
                    jwtService.generateTwoFactorTempToken(user.getId(), AccountType.USER);
            return AdminAuthResult.challenge(tempToken);
        }

        // Enforced 2FA Policy: Mandatory onboarding for all administrators
        String setupToken = jwtService.generateTwoFactorSetupToken(user.getId(), AccountType.USER);
        return AdminAuthResult.setupRequired(setupToken);
    }

    @Override
    @Transactional
    public TwoFactorSetupResource initiateTwoFactorSetup(String tempToken) {
        Long userId = validatePreAuthToken(tempToken, JwtService.PURPOSE_2FA_SETUP);
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        if (!user.hasRole(RoleType.ADMIN)) {
            throw new AppException(ErrorCode.ADMIN_ACCESS_REQUIRED);
        }
        return twoFactorService.setup(userId, user.getEmail());
    }

    @Override
    @Transactional
    public AdminAuthResult confirmTwoFactorSetup(
            TwoFactorChallengeRequest request, String userAgent, String ip) {
        Long userId = validatePreAuthToken(request.tempToken(), JwtService.PURPOSE_2FA_SETUP);
        User user =
                userRepository
                        .findByIdWithRoles(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        if (!user.hasRole(RoleType.ADMIN)) {
            throw new AppException(ErrorCode.ADMIN_ACCESS_REQUIRED);
        }

        twoFactorService.confirm(userId, request.code());

        AuthResult session = authSessionService.open(user, userAgent, ip);
        userRepository.touchLastLogin(user.getId(), Instant.now());
        AdminProfileResource profile = buildProfile(user);
        return new AdminAuthResult(session.accessToken(), session.refreshToken(), profile);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean verifyPassword(Long adminUserId, String password) {
        User user =
                userRepository
                        .findById(adminUserId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    @Transactional(readOnly = true)
    public TwoFactorStatusResource getTwoFactorStatus(Long adminUserId) {
        return twoFactorService.getStatus(adminUserId);
    }

    @Override
    @Transactional
    public TwoFactorSetupResource reconfigureTwoFactor(Long adminUserId, String password) {
        if (!verifyPassword(adminUserId, password)) {
            throw AppException.validation("password", "Incorrect password.");
        }
        User user =
                userRepository
                        .findById(adminUserId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        return twoFactorService.setup(adminUserId, user.getEmail());
    }

    @Override
    @Transactional
    public TwoFactorStatusResource confirmTwoFactorReconfigure(Long adminUserId, String code) {
        return twoFactorService.confirm(adminUserId, code);
    }

    @Override
    @Transactional
    public List<String> regenerateRecoveryCodes(Long adminUserId, String password) {
        if (!verifyPassword(adminUserId, password)) {
            throw AppException.validation("password", "Incorrect password.");
        }
        return twoFactorService.regenerateRecoveryCodes(adminUserId);
    }

    private Long validatePreAuthToken(String token, String expectedPurpose) {
        try {
            String purpose = jwtService.extractAllClaims(token).get("purp", String.class);
            if (!expectedPurpose.equals(purpose)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            return jwtService.extractSubject(token);
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    @Override
    @Transactional
    public AdminAuthResult verifyTwoFactor(
            TwoFactorChallengeRequest request, String userAgent, String ip) {
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

        if (!user.hasRole(RoleType.ADMIN)) {
            throw new AppException(ErrorCode.ADMIN_ACCESS_REQUIRED);
        }

        AuthResult session = authSessionService.open(user, userAgent, ip);
        userRepository.touchLastLogin(user.getId(), Instant.now());
        AdminProfileResource profile = buildProfile(user);
        return new AdminAuthResult(session.accessToken(), session.refreshToken(), profile);
    }

    @Override
    @Transactional
    public AdminAuthResult refresh(String refreshToken, String userAgent, String ip) {
        RefreshResult rotated = refreshTokenService.rotateToken(refreshToken, userAgent, ip);
        User user =
                userRepository
                        .findByIdWithRoles(rotated.userId())
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        if (!user.hasRole(RoleType.ADMIN) || user.getStatus() != UserStatus.ACTIVE) {
            throw new AppException(ErrorCode.ADMIN_ACCESS_REQUIRED);
        }

        AuthResult session = authSessionService.renew(user, rotated.newRefreshToken());
        AdminProfileResource profile = buildProfile(user);
        return new AdminAuthResult(session.accessToken(), session.refreshToken(), profile);
    }

    @Override
    public void logout(String accessToken, String refreshToken) {
        Map<String, Object> revocation = jwtService.extractRevoke(accessToken);
        blacklistService.revoke(
                (String) revocation.get("jti"), (Instant) revocation.get("expiresAt"));
        authSessionService.invalidate(jwtService.extractSubject(accessToken));
        if (refreshToken != null) {
            try {
                refreshTokenService.revokeToken(refreshToken);
            } catch (AppException e) {
                log.warn("Admin refresh token was already revoked during logout");
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProfileResource getMe(Long adminUserId) {
        User user =
                userRepository
                        .findByIdWithRoles(adminUserId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        if (!user.hasRole(RoleType.ADMIN)) {
            throw new AppException(ErrorCode.ADMIN_ACCESS_REQUIRED);
        }
        return buildProfile(user);
    }

    private AdminProfileResource buildProfile(User user) {
        Set<String> roleNames =
                user.activeRoleTypes().stream().map(RoleType::name).collect(Collectors.toSet());

        long pendingVerifications =
                businessDocumentRepository.countGroupedByReviewStatus().stream()
                        .filter(c -> c.getStatus() == DocumentReviewStatus.PENDING_REVIEW)
                        .mapToLong(BusinessDocumentRepository.ReviewStatusCount::getTotal)
                        .sum();

        long totalUsers = userRepository.count();
        long totalRecruiters = recruiterRepository.count();
        long activeCompanies = companyRepository.count();

        AdminQueueCountsResource queueCounts =
                new AdminQueueCountsResource(
                        pendingVerifications, totalUsers, totalRecruiters, activeCompanies);

        return new AdminProfileResource(
                user.getId(),
                user.getName(),
                user.getEmail(),
                roleNames,
                twoFactorService.isTwoFactorEnabled(user.getId()),
                user.getLastLoginAt(),
                queueCounts);
    }
}
