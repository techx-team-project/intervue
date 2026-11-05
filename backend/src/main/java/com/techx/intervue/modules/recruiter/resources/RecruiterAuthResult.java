package com.techx.intervue.modules.recruiter.resources;

public record RecruiterAuthResult(
        String accessToken,
        String refreshToken,
        RecruiterResource recruiter,
        Boolean requiresTwoFactor,
        String tempToken) {
    public RecruiterAuthResult(
            String accessToken, String refreshToken, RecruiterResource recruiter) {
        this(accessToken, refreshToken, recruiter, false, null);
    }

    public static RecruiterAuthResult challenge(String tempToken) {
        return new RecruiterAuthResult(null, null, null, true, tempToken);
    }
}
