package com.techx.intervue.modules.recruiter.resources;

public record RecruiterAuthResult(
        String accessToken,
        String refreshToken,
        RecruiterResource recruiter,
        Boolean requiresTwoFactor,
        String tempToken,
        String deviceTrustToken) {

    public RecruiterAuthResult(
            String accessToken, String refreshToken, RecruiterResource recruiter) {
        this(accessToken, refreshToken, recruiter, false, null, null);
    }

    public RecruiterAuthResult(
            String accessToken,
            String refreshToken,
            RecruiterResource recruiter,
            String deviceTrustToken) {
        this(accessToken, refreshToken, recruiter, false, null, deviceTrustToken);
    }

    public static RecruiterAuthResult challenge(String tempToken) {
        return new RecruiterAuthResult(null, null, null, true, tempToken, null);
    }
}
