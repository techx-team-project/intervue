package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.job.enums.SalaryCurrency;
import java.time.LocalDate;
import java.time.ZoneId;

public final class JobLimits {

    public static final long MIN_SALARY_VND = 1_000_000L;
    public static final long MIN_SALARY_USD = 50L;
    public static final long MAX_SALARY_VND = 250_000_000L;
    public static final long MAX_SALARY_USD = 10_000L;
    public static final int MAX_DEADLINE_DAYS = 90;

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private JobLimits() {}

    public static boolean isSalaryWithinLimit(SalaryCurrency currency, Long amount) {
        if (amount == null) {
            return true;
        }
        boolean usd = currency == SalaryCurrency.USD;
        long min = usd ? MIN_SALARY_USD : MIN_SALARY_VND;
        long max = usd ? MAX_SALARY_USD : MAX_SALARY_VND;
        return amount >= min && amount <= max;
    }

    public static boolean isDeadlineWithinLimit(LocalDate deadline) {
        return deadline == null
                || !deadline.isAfter(LocalDate.now(BUSINESS_ZONE).plusDays(MAX_DEADLINE_DAYS));
    }
}
