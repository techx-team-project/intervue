package com.techx.intervue.modules.notification.requests;

import com.techx.intervue.modules.notification.enums.NotificationCategory;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdatePreferencesRequest(@NotEmpty @Valid List<Entry> preferences) {

    public record Entry(
            @NotNull NotificationCategory category,
            @NotNull Boolean inApp,
            @NotNull Boolean email) {}
}
