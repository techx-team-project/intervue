package com.techx.intervue.modules.billing.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.billing.requests.SaveFreeQuotaSettingsRequest;
import com.techx.intervue.modules.billing.resources.FreeQuotaSettingsResource;

public interface AdminFreeQuotaServiceInterface {

    FreeQuotaSettingsResource getSettings();

    FreeQuotaSettingsResource updateSettings(
            SaveFreeQuotaSettingsRequest request, RequestActor actor);
}
