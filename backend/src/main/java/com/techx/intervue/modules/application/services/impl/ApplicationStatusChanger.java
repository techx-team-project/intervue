package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.ApplicationStatusHistory;
import com.techx.intervue.modules.application.enums.ApplicationActorType;
import com.techx.intervue.modules.application.enums.ApplicationStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicationStatusChanger {

    private final ApplicationStatusPolicy statusPolicy;

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
    }
}
