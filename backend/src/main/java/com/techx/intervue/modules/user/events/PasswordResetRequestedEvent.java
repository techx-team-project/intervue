package com.techx.intervue.modules.user.events;

public record PasswordResetRequestedEvent(Long userId, String email, String name) {}
