package com.techx.intervue.modules.recruiter.events;

public record RecruiterEmailChangeRequestedEvent(
        Long recruiterId, String name, String oldEmail, String newEmail) {}
