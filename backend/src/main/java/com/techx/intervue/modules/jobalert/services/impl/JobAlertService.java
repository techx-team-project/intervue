package com.techx.intervue.modules.jobalert.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.jobalert.entities.JobAlert;
import com.techx.intervue.modules.jobalert.enums.AlertFrequency;
import com.techx.intervue.modules.jobalert.mappers.JobAlertMapper;
import com.techx.intervue.modules.jobalert.repositories.JobAlertDeliveryRepository;
import com.techx.intervue.modules.jobalert.repositories.JobAlertRepository;
import com.techx.intervue.modules.jobalert.requests.CreateJobAlertRequest;
import com.techx.intervue.modules.jobalert.requests.UnsubscribeActionRequest;
import com.techx.intervue.modules.jobalert.requests.UpdateJobAlertRequest;
import com.techx.intervue.modules.jobalert.resources.JobAlertResource;
import com.techx.intervue.modules.jobalert.resources.JobAlertSummaryResource;
import com.techx.intervue.modules.jobalert.resources.JobAlertUnsubscribeResource;
import com.techx.intervue.modules.jobalert.services.interfaces.JobAlertDispatchServiceInterface;
import com.techx.intervue.modules.jobalert.services.interfaces.JobAlertServiceInterface;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class JobAlertService implements JobAlertServiceInterface {

    private static final int MAX_ALERTS_PER_USER = 10;

    private final JobAlertRepository alertRepository;
    private final JobAlertDeliveryRepository deliveryRepository;
    private final JobAlertMapper mapper;
    private final JobAlertDispatchServiceInterface dispatchService;

    @Override
    @Transactional(readOnly = true)
    public List<JobAlertResource> listCandidateAlerts(Long userId) {
        List<JobAlert> alerts = alertRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        List<JobAlertResource> result = new ArrayList<>();
        for (JobAlert alert : alerts) {
            long deliveredCount = deliveryRepository.findJobIdsByAlertId(alert.getId()).size();
            result.add(mapper.toResource(alert, deliveredCount));
        }
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public JobAlertSummaryResource getCandidateSummary(Long userId) {
        long total = alertRepository.countByUserId(userId);
        long active = alertRepository.countByUserIdAndIsActiveTrue(userId);
        long paused = Math.max(0, total - active);

        List<JobAlert> alerts = alertRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        long deliveries = 0;
        for (JobAlert alert : alerts) {
            deliveries += deliveryRepository.findJobIdsByAlertId(alert.getId()).size();
        }

        return new JobAlertSummaryResource(total, active, paused, deliveries);
    }

    @Override
    @Transactional
    public JobAlertResource createAlert(Long userId, CreateJobAlertRequest request) {
        long currentCount = alertRepository.countByUserId(userId);
        if (currentCount >= MAX_ALERTS_PER_USER) {
            throw AppException.validation(
                    "title",
                    "You have reached the limit of " + MAX_ALERTS_PER_USER + " job alerts.");
        }

        String token = UUID.randomUUID().toString().replace("-", "");

        JobAlert alert =
                JobAlert.builder()
                        .userId(userId)
                        .title(request.title().trim())
                        .keyword(
                                request.keyword() != null && !request.keyword().isBlank()
                                        ? request.keyword().trim()
                                        : null)
                        .city(
                                request.city() != null && !request.city().isBlank()
                                        ? request.city().trim()
                                        : null)
                        .careerLevel(
                                request.careerLevel() != null && !request.careerLevel().isBlank()
                                        ? request.careerLevel().trim()
                                        : null)
                        .workMode(
                                request.workMode() != null && !request.workMode().isBlank()
                                        ? request.workMode().trim()
                                        : null)
                        .salaryMin(request.salaryMin())
                        .currency(
                                request.currency() != null && !request.currency().isBlank()
                                        ? request.currency().trim()
                                        : "VND")
                        .frequency(
                                request.frequency() != null
                                        ? request.frequency()
                                        : AlertFrequency.DAILY)
                        .isActive(true)
                        .unsubscribeToken(token)
                        .build();

        JobAlert saved = alertRepository.save(alert);
        return mapper.toResource(saved, 0);
    }

    @Override
    @Transactional(readOnly = true)
    public JobAlertResource getAlert(Long alertId, Long userId) {
        JobAlert alert =
                alertRepository
                        .findByIdAndUserId(alertId, userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        long count = deliveryRepository.findJobIdsByAlertId(alert.getId()).size();
        return mapper.toResource(alert, count);
    }

    @Override
    @Transactional
    public JobAlertResource updateAlert(Long alertId, Long userId, UpdateJobAlertRequest request) {
        JobAlert alert =
                alertRepository
                        .findByIdAndUserId(alertId, userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        alert.setTitle(request.title().trim());
        alert.setKeyword(
                request.keyword() != null && !request.keyword().isBlank()
                        ? request.keyword().trim()
                        : null);
        alert.setCity(
                request.city() != null && !request.city().isBlank() ? request.city().trim() : null);
        alert.setCareerLevel(
                request.careerLevel() != null && !request.careerLevel().isBlank()
                        ? request.careerLevel().trim()
                        : null);
        alert.setWorkMode(
                request.workMode() != null && !request.workMode().isBlank()
                        ? request.workMode().trim()
                        : null);
        alert.setSalaryMin(request.salaryMin());
        if (request.currency() != null && !request.currency().isBlank()) {
            alert.setCurrency(request.currency().trim());
        }
        if (request.frequency() != null) {
            alert.setFrequency(request.frequency());
        }
        if (request.isActive() != null) {
            alert.setActive(request.isActive());
        }

        JobAlert updated = alertRepository.save(alert);
        long count = deliveryRepository.findJobIdsByAlertId(updated.getId()).size();
        return mapper.toResource(updated, count);
    }

    @Override
    @Transactional
    public JobAlertResource toggleAlert(Long alertId, Long userId) {
        JobAlert alert =
                alertRepository
                        .findByIdAndUserId(alertId, userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        alert.setActive(!alert.isActive());
        JobAlert saved = alertRepository.save(alert);
        long count = deliveryRepository.findJobIdsByAlertId(saved.getId()).size();
        return mapper.toResource(saved, count);
    }

    @Override
    @Transactional
    public void deleteAlert(Long alertId, Long userId) {
        JobAlert alert =
                alertRepository
                        .findByIdAndUserId(alertId, userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        alertRepository.delete(alert);
    }

    @Override
    @Transactional(readOnly = true)
    public JobAlertUnsubscribeResource getUnsubscribeInfo(String token) {
        JobAlert alert =
                alertRepository
                        .findByUnsubscribeToken(token)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return mapper.toUnsubscribeResource(alert);
    }

    @Override
    @Transactional
    public void processUnsubscribe(UnsubscribeActionRequest request) {
        JobAlert alert =
                alertRepository
                        .findByUnsubscribeToken(request.token())
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        if ("PAUSE".equalsIgnoreCase(request.action())) {
            alert.setActive(false);
            alertRepository.save(alert);
        } else if ("DELETE".equalsIgnoreCase(request.action())) {
            alertRepository.delete(alert);
        }
    }

    @Override
    @Transactional
    public boolean sendTestAlertEmail(Long alertId, Long userId) {
        JobAlert alert =
                alertRepository
                        .findByIdAndUserId(alertId, userId)
                        .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        return dispatchService.dispatchSingleAlert(alert, true);
    }
}
