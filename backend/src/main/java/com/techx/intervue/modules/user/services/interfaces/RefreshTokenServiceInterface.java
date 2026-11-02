package com.techx.intervue.modules.user.services.interfaces;

public interface RefreshTokenServiceInterface {

    String generateRefreshTokenRaw();

    IssuedToken issueRefreshToken(Long userId);

    IssuedToken issueRefreshToken(Long userId, String userAgent, String ip);

    RefreshResult rotateToken(String rawToken);

    RefreshResult rotateToken(String rawToken, String userAgent, String ip);

    void revokeToken(String rawToken);

    record RefreshResult(Long userId, String newRefreshToken) {}

    record IssuedToken(String rawToken, Long tokenId) {}
}
