package com.techx.intervue.modules.recruiter.resources;

public record RecruiterAuthResource(
        String accessToken,
        RecruiterResource recruiter,
        Boolean requiresTwoFactor,
        String tempToken,
        Boolean newAccount) {
    public RecruiterAuthResource(
            String accessToken, RecruiterResource recruiter, Boolean newAccount) {
        this(accessToken, recruiter, false, null, newAccount);
    }

    public static RecruiterAuthResource challenge(String tempToken) {
        return new RecruiterAuthResource(null, null, true, tempToken, false);
    }
}
