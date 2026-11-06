package com.techx.intervue.modules.job.services.impl;

import java.time.LocalDate;
import java.time.ZoneId;

final class JobDeadlines {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private JobDeadlines() {}

    static LocalDate today() {
        return LocalDate.now(BUSINESS_ZONE);
    }
}
