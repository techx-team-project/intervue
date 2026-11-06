package com.techx.intervue.modules.notification.controllers;

import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPreferenceServiceInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationQueryServiceInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationStateServiceInterface;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/notifications")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterNotificationController extends AbstractNotificationController {

    public RecruiterNotificationController(
            NotificationQueryServiceInterface queryService,
            NotificationStateServiceInterface stateService,
            NotificationPreferenceServiceInterface preferenceService) {
        super(queryService, stateService, preferenceService);
    }

    @Override
    protected RecipientType recipientType() {
        return RecipientType.RECRUITER;
    }
}
