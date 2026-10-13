package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.services.interfaces.AuthServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.AuthSessionServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.JwtServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.LoginAttemptServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface.RefreshResult;
import com.techx.intervue.services.interfaces.BlacklistServiceInterface;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService implements AuthServiceInterface {

    private static final String DUMMY_PASSWORD_HASH =
            "$2a$10$eM4EXOxqLsBgw6Tq.SA/4uIAlNcwCwXwH.1Pk/0NXTeaEo7AyQ82O";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptServiceInterface loginAttemptService;
    private final AuthSessionServiceInterface authSessionService;
    private final RefreshTokenServiceInterface refreshTokenService;
    private final JwtServiceInterface jwtService;
    private final BlacklistServiceInterface blacklistService;

    @Override
    public AuthResult login(LoginRequest request, String ip) {
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
        return authSessionService.open(found.get());
    }

    @Override
    public AuthResult refresh(String refreshToken) {
        RefreshResult rotated = refreshTokenService.rotateToken(refreshToken);
        User user =
                userRepository
                        .findByIdWithRoles(rotated.userId())
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        return authSessionService.renew(user, rotated.newRefreshToken());
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
