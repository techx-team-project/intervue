package com.techx.intervue.modules.recruiter.resources;

public record RecruiterAuthResource(
        String accessToken,
        RecruiterResource recruiter,
        Boolean requiresTwoFactor,
        String tempToken) {
    public RecruiterAuthResource(String accessToken, RecruiterResource recruiter) {
        this(accessToken, recruiter, false, null);
    }

    public static RecruiterAuthResource challenge(String tempToken) {
        return new RecruiterAuthResource(null, null, true, tempToken);
    }
}
