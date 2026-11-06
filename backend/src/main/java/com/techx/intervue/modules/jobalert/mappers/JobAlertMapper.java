package com.techx.intervue.modules.jobalert.mappers;

import com.techx.intervue.modules.jobalert.entities.JobAlert;
import com.techx.intervue.modules.jobalert.resources.JobAlertResource;
import com.techx.intervue.modules.jobalert.resources.JobAlertUnsubscribeResource;
import org.springframework.stereotype.Component;

@Component
public class JobAlertMapper {

    public JobAlertResource toResource(JobAlert alert, long deliveredCount) {
        if (alert == null) {
            return null;
        }
        return new JobAlertResource(
                alert.getId(),
                alert.getUserId(),
                alert.getTitle(),
                alert.getKeyword(),
                alert.getCity(),
                alert.getCareerLevel(),
                alert.getWorkMode(),
                alert.getSalaryMin(),
                alert.getCurrency(),
                alert.getFrequency(),
                alert.isActive(),
                alert.getUnsubscribeToken(),
                alert.getLastSentAt(),
                alert.getCreatedAt(),
                alert.getUpdatedAt(),
                deliveredCount);
    }

    public JobAlertUnsubscribeResource toUnsubscribeResource(JobAlert alert) {
        if (alert == null) {
            return null;
        }
        return new JobAlertUnsubscribeResource(
                alert.getId(),
                alert.getTitle(),
                alert.getKeyword(),
                alert.getCity(),
                alert.getFrequency(),
                alert.isActive(),
                alert.getUnsubscribeToken());
    }
}
