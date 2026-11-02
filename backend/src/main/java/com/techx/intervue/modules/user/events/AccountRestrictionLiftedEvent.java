package com.techx.intervue.modules.user.events;

public record AccountRestrictionLiftedEvent(Long userId, String email, String name) {}
