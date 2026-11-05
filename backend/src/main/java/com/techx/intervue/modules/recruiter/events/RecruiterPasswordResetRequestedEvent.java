package com.techx.intervue.modules.recruiter.events;

public record RecruiterPasswordResetRequestedEvent(Long recruiterId, String email, String name) {}
