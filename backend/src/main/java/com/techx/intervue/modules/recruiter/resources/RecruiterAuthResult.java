package com.techx.intervue.modules.recruiter.resources;

public record RecruiterAuthResult(
        String accessToken, String refreshToken, RecruiterResource recruiter) {}
