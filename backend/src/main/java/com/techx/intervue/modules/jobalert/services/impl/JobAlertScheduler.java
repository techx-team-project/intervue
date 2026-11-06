package com.techx.intervue.modules.jobalert.services.impl;

import com.techx.intervue.modules.jobalert.enums.AlertFrequency;
import com.techx.intervue.modules.jobalert.services.interfaces.JobAlertDispatchServiceInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class JobAlertScheduler {

    private final JobAlertDispatchServiceInterface dispatchService;

    // Run at 08:00 AM every day
    @Scheduled(cron = "0 0 8 * * *")
    public void runDailyJobAlerts() {
        log.info("Starting Daily Job Alert dispatch scheduler...");
        int dispatched = dispatchService.dispatchFrequency(AlertFrequency.DAILY);
        log.info("Completed Daily Job Alert dispatch. Total sent: {}", dispatched);
    }

    // Run at 08:00 AM every Monday
    @Scheduled(cron = "0 0 8 * * MON")
    public void runWeeklyJobAlerts() {
        log.info("Starting Weekly Job Alert dispatch scheduler...");
        int dispatched = dispatchService.dispatchFrequency(AlertFrequency.WEEKLY);
        log.info("Completed Weekly Job Alert dispatch. Total sent: {}", dispatched);
    }
}
