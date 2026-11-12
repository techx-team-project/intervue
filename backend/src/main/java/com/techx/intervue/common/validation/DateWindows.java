package com.techx.intervue.common.validation;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

public final class DateWindows {

    public static final int INTERVIEW_MAX_DAYS = 30;
    public static final int BROADCAST_MAX_DAYS = 90;

    private DateWindows() {}

    public static boolean isWithinFutureWindow(Instant moment, int maxDays) {
        return moment == null || !moment.isAfter(Instant.now().plus(maxDays, ChronoUnit.DAYS));
    }
}
