package com.techx.intervue.modules.user.events;

public record EmailChangeRequestedEvent(
        Long userId, String name, String oldEmail, String newEmail) {}
