package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.modules.application.entities.Interview;
import com.techx.intervue.modules.application.enums.InterviewEventType;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import com.techx.intervue.modules.application.events.InterviewEvent;
import com.techx.intervue.modules.application.repositories.InterviewRepository;
import java.time.Duration;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InterviewReminderService {

    private static final Duration DAY_AHEAD = Duration.ofHours(24);
    private static final Duration HOUR_AHEAD = Duration.ofHours(1);

    private final InterviewRepository interviewRepository;
    private final ApplicationEventPublisher events;

    @Scheduled(fixedDelayString = "PT5M", initialDelayString = "PT1M")
    @Transactional
    public void sendDueReminders() {
        Instant now = Instant.now();
        for (Interview interview :
                interviewRepository.findDueFor1hReminder(
                        InterviewStatus.CONFIRMED, now, now.plus(HOUR_AHEAD))) {
            interview.setReminder1hSent(true);
            interview.setReminder24hSent(true);
            events.publishEvent(
                    new InterviewEvent(interview.getId(), InterviewEventType.REMINDER_1H));
        }
        for (Interview interview :
                interviewRepository.findDueFor24hReminder(
                        InterviewStatus.CONFIRMED, now, now.plus(DAY_AHEAD))) {
            interview.setReminder24hSent(true);
            events.publishEvent(
                    new InterviewEvent(interview.getId(), InterviewEventType.REMINDER_24H));
        }
    }
}
