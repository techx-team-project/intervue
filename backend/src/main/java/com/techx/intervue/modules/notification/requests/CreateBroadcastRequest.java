package com.techx.intervue.modules.notification.requests;

import com.techx.intervue.common.validation.DateWindows;
import com.techx.intervue.modules.notification.enums.BroadcastAudience;
import com.techx.intervue.modules.notification.enums.NotificationSeverity;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record CreateBroadcastRequest(
        @NotNull BroadcastAudience audience,
        @NotNull NotificationSeverity severity,
        @NotBlank @Size(max = 255) String title,
        @NotBlank @Size(max = 500) String summary,
        @NotBlank @Size(max = 20000) String bodyMarkdown,
        @Size(max = 500) String actionUrl,
        @Size(max = 100) String actionLabel,
        @Future Instant scheduledAt) {

    @AssertTrue
    public boolean isScheduleWithinWindow() {
        return DateWindows.isWithinFutureWindow(scheduledAt, DateWindows.BROADCAST_MAX_DAYS);
    }
}
