package com.techx.intervue.modules.jobalert.services.interfaces;

import com.techx.intervue.modules.jobalert.entities.JobAlert;
import com.techx.intervue.modules.jobalert.enums.AlertFrequency;

public interface JobAlertDispatchServiceInterface {

    int dispatchFrequency(AlertFrequency frequency);

    boolean dispatchSingleAlert(JobAlert alert, boolean forceSend);
}
