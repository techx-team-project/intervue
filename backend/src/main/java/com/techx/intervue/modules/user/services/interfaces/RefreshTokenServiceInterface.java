package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.enums.TokenOrigin;

public interface RefreshTokenServiceInterface {

    String generateRefreshTokenRaw();

    IssuedToken issueRefreshToken(Long userId);

    IssuedToken issueRefreshToken(Long userId, String userAgent, String ip);

    IssuedToken issueRefreshToken(Long userId, String userAgent, String ip, TokenOrigin origin);

    RefreshResult rotateToken(String rawToken);

    RefreshResult rotateToken(String rawToken, String userAgent, String ip);

    void revokeToken(String rawToken);

    record RefreshResult(Long userId, String newRefreshToken) {}

    record IssuedToken(String rawToken, Long tokenId) {}
}
