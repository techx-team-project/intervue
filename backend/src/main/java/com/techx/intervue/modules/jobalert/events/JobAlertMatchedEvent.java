package com.techx.intervue.modules.jobalert.events;

public record JobAlertMatchedEvent(Long alertId, Long userId, int matchCount) {}
