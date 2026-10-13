package com.techx.intervue.modules.user.events;

public record EmailVerificationRequestedEvent(Long userId, String email, String name) {}
