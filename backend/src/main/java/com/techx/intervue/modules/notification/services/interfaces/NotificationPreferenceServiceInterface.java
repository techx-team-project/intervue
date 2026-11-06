package com.techx.intervue.modules.notification.services.interfaces;

import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.requests.UpdatePreferencesRequest;
import com.techx.intervue.modules.notification.resources.NotificationPreferenceResource;
import java.util.List;

public interface NotificationPreferenceServiceInterface {

    List<NotificationPreferenceResource> findAll(RecipientType recipientType, Long recipientId);

    List<NotificationPreferenceResource> update(
            RecipientType recipientType, Long recipientId, UpdatePreferencesRequest request);
}
