package com.techx.intervue.modules.recruiter.services.interfaces;

public interface RecruiterRefreshTokenServiceInterface {

    record IssuedToken(String rawToken, Long tokenId) {}

    record RefreshResult(Long recruiterId, String newRefreshToken) {}

    IssuedToken issue(Long recruiterId, String userAgent, String ip);

    RefreshResult rotate(String rawToken, String userAgent, String ip);

    void revoke(String rawToken);
}
