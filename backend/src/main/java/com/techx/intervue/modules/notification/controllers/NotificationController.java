package com.techx.intervue.modules.notification.controllers;

import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPreferenceServiceInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationQueryServiceInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationStateServiceInterface;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
public class NotificationController extends AbstractNotificationController {

    public NotificationController(
            NotificationQueryServiceInterface queryService,
            NotificationStateServiceInterface stateService,
            NotificationPreferenceServiceInterface preferenceService) {
        super(queryService, stateService, preferenceService);
    }

    @Override
    protected RecipientType recipientType() {
        return RecipientType.USER;
    }
}
