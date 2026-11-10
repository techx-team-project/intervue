package com.techx.intervue.modules.ads.services.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;

/** Ad inventory is sold in whole ISO weeks, so every date here is the Monday that starts one. */
public final class AdWeeks {

    public static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");

    private AdWeeks() {}

    public static LocalDate today() {
        return LocalDate.now(VIETNAM);
    }

    public static LocalDate currentWeek() {
        return startOf(today());
    }

    public static LocalDate startOf(LocalDate date) {
        return date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
    }

    /** The first week a buyer may book: this week is already running, so selling it would cheat. */
    public static LocalDate firstBookable() {
        return currentWeek().plusWeeks(1);
    }

    public static boolean isBookable(LocalDate weekStart) {
        return weekStart.equals(startOf(weekStart)) && !weekStart.isBefore(firstBookable());
    }
}
