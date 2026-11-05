package com.techx.intervue.modules.recruiter.events;

public record RecruiterEmailVerificationRequestedEvent(
        Long recruiterId, String email, String name) {}
