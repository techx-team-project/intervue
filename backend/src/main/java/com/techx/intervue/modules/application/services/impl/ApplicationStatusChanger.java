package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.ApplicationStatusHistory;
import com.techx.intervue.modules.application.enums.ApplicationActorType;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.enums.InterviewEventType;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import com.techx.intervue.modules.application.events.InterviewEvent;
import com.techx.intervue.modules.application.repositories.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationStatusChanger {

    private static final String REJECTED_REASON = "The application was rejected";
    private static final String WITHDRAWN_REASON = "The candidate withdrew the application";

    private final ApplicationStatusPolicy statusPolicy;
    private final InterviewRepository interviewRepository;
    private final ApplicationEventPublisher events;

    public void change(
            Application application,
            ApplicationStatus next,
            ApplicationActorType actorType,
            Long actorId,
            String note) {
        ApplicationStatus previous = application.getStatus();
        statusPolicy.requireTransition(previous, next);
        application.setStatus(next);
        application
                .getHistory()
                .add(
                        ApplicationStatusHistory.builder()
                                .application(application)
                                .fromStatus(previous)
                                .toStatus(next)
                                .actorType(actorType)
                                .actorId(actorId)
                                .note(note)
                                .build());
        cancelOpenInterviews(application, next);
    }

    // Withdrawals stay silent: the recruiter already gets the withdrawal notification.
    private void cancelOpenInterviews(Application application, ApplicationStatus next) {
        if (next != ApplicationStatus.REJECTED && next != ApplicationStatus.WITHDRAWN) {
            return;
        }
        boolean rejected = next == ApplicationStatus.REJECTED;
        interviewRepository
                .findByApplicationIdAndStatusIn(application.getId(), InterviewStatus.ACTIVE)
                .forEach(
                        interview -> {
                            interview.setStatus(InterviewStatus.CANCELLED);
                            interview.setCancelReason(
                                    rejected ? REJECTED_REASON : WITHDRAWN_REASON);
                            if (rejected) {
                                events.publishEvent(
                                        new InterviewEvent(
                                                interview.getId(), InterviewEventType.CANCELLED));
                            }
                        });
    }
}
