package com.techx.intervue.modules.jobalert.services.interfaces;

import com.techx.intervue.modules.jobalert.requests.CreateJobAlertRequest;
import com.techx.intervue.modules.jobalert.requests.UnsubscribeActionRequest;
import com.techx.intervue.modules.jobalert.requests.UpdateJobAlertRequest;
import com.techx.intervue.modules.jobalert.resources.JobAlertResource;
import com.techx.intervue.modules.jobalert.resources.JobAlertSummaryResource;
import com.techx.intervue.modules.jobalert.resources.JobAlertUnsubscribeResource;
import java.util.List;

public interface JobAlertServiceInterface {

    List<JobAlertResource> listCandidateAlerts(Long userId);

    JobAlertSummaryResource getCandidateSummary(Long userId);

    JobAlertResource createAlert(Long userId, CreateJobAlertRequest request);

    JobAlertResource getAlert(Long alertId, Long userId);

    JobAlertResource updateAlert(Long alertId, Long userId, UpdateJobAlertRequest request);

    JobAlertResource toggleAlert(Long alertId, Long userId);

    void deleteAlert(Long alertId, Long userId);

    JobAlertUnsubscribeResource getUnsubscribeInfo(String token);

    void processUnsubscribe(UnsubscribeActionRequest request);

    boolean sendTestAlertEmail(Long alertId, Long userId);
}
