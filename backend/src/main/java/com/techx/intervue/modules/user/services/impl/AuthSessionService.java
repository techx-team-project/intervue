package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.mappers.UserMapper;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.services.interfaces.AuthSessionServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.JwtServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.RefreshTokenServiceInterface.IssuedToken;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthSessionService implements AuthSessionServiceInterface {

    private final JwtServiceInterface jwtService;
    private final RefreshTokenServiceInterface refreshTokenService;
    private final UserSessionCache userSessionCache;
    private final AuthConfig authConfig;
    private final UserMapper userMapper;

    @Override
    public AuthResult open(User user) {
        String accessToken = grantAccess(user);
        IssuedToken refreshToken = refreshTokenService.issueRefreshToken(user.getId());
        return new AuthResult(accessToken, refreshToken.rawToken(), userMapper.toResource(user));
    }

    @Override
    public AuthResult renew(User user, String refreshToken) {
        return new AuthResult(grantAccess(user), refreshToken, userMapper.toResource(user));
    }

    private String grantAccess(User user) {
        userSessionCache.set(
                user.getId(),
                user.getEmail(),
                user.activeRoleTypes(),
                Duration.ofMillis(authConfig.getExpirationTime()));
        return jwtService.generateToken(user.getId());
    }
}
