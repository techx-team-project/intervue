package com.techx.intervue.modules.jobalert.services.impl;

import com.techx.intervue.config.AppProperties;
import com.techx.intervue.modules.ai.resources.JobSearchResult;
import com.techx.intervue.modules.ai.services.interfaces.JobSearchServiceInterface;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import com.techx.intervue.modules.jobalert.entities.JobAlert;
import com.techx.intervue.modules.jobalert.entities.JobAlertDelivery;
import com.techx.intervue.modules.jobalert.enums.AlertFrequency;
import com.techx.intervue.modules.jobalert.events.JobAlertMatchedEvent;
import com.techx.intervue.modules.jobalert.repositories.JobAlertDeliveryRepository;
import com.techx.intervue.modules.jobalert.repositories.JobAlertRepository;
import com.techx.intervue.modules.jobalert.services.interfaces.JobAlertDispatchServiceInterface;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.services.interfaces.MailServiceInterface;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

@Service
@Slf4j
@RequiredArgsConstructor
public class JobAlertDispatchService implements JobAlertDispatchServiceInterface {

    private static final int MAX_JOBS_PER_EMAIL = 5;

    private final JobAlertRepository alertRepository;
    private final JobAlertDeliveryRepository deliveryRepository;
    private final EntitlementServiceInterface entitlementService;
    private final PublicJobServiceInterface publicJobService;
    private final UserRepository userRepository;
    private final JobSearchServiceInterface jobSearchService;
    private final MailServiceInterface mailService;
    private final AppProperties appProperties;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public int dispatchFrequency(AlertFrequency frequency) {
        List<JobAlert> activeAlerts = alertRepository.findAllByIsActiveTrueAndFrequency(frequency);
        int sentCount = 0;
        for (JobAlert alert : activeAlerts) {
            try {
                if (dispatchSingleAlert(alert, false)) {
                    sentCount++;
                }
            } catch (Exception e) {
                log.error("Failed to dispatch alert id {}: {}", alert.getId(), e.getMessage());
            }
        }
        return sentCount;
    }

    @Override
    @Transactional
    public boolean dispatchSingleAlert(JobAlert alert, boolean forceSend) {
        User user = userRepository.findById(alert.getUserId()).orElse(null);
        if (user == null || user.getEmail() == null || user.getEmail().isBlank()) {
            return false;
        }

        List<JobSearchResult> searchResults =
                jobSearchService.search(
                        alert.getKeyword(), alert.getCareerLevel(), alert.getCity(), null, 12);

        Set<String> deliveredIds = deliveryRepository.findJobIdsByAlertId(alert.getId());

        List<JobSearchResult> jobsToSend = new ArrayList<>();
        for (JobSearchResult job : searchResults) {
            if (!deliveredIds.contains(job.id())) {
                jobsToSend.add(job);
            }
        }

        if (forceSend && jobsToSend.isEmpty() && !searchResults.isEmpty()) {
            jobsToSend.addAll(searchResults.stream().limit(3).toList());
        }

        if (jobsToSend.isEmpty()) {
            return false;
        }

        List<JobSearchResult> finalJobs = pickWithPaidPriority(jobsToSend);
        String cardsHtml = renderJobCards(finalJobs);

        String frontendUrl =
                appProperties.frontendUrl() != null
                        ? appProperties.frontendUrl()
                        : "https://intervue.app";
        String encodedKeyword =
                alert.getKeyword() != null
                        ? URLEncoder.encode(alert.getKeyword(), StandardCharsets.UTF_8)
                        : "";
        String encodedCity =
                alert.getCity() != null
                        ? URLEncoder.encode(alert.getCity(), StandardCharsets.UTF_8)
                        : "";
        String viewAllUrl =
                frontendUrl + "/jobs?keyword=" + encodedKeyword + "&city=" + encodedCity;
        String unsubscribeUrl =
                frontendUrl + "/job-alerts/unsubscribe?token=" + alert.getUnsubscribeToken();

        String subject =
                "[InterVue] "
                        + finalJobs.size()
                        + " new job matches for \""
                        + alert.getTitle()
                        + "\"";

        Map<String, String> variables =
                Map.of(
                        "name",
                        user.getName() != null ? user.getName() : "Candidate",
                        "alertTitle",
                        alert.getTitle(),
                        "matchCount",
                        String.valueOf(finalJobs.size()),
                        "viewAllUrl",
                        viewAllUrl,
                        "unsubscribeUrl",
                        unsubscribeUrl);

        Map<String, String> rawVariables = Map.of("jobCardsHtml", cardsHtml);

        mailService.sendHtmlWithRaw(
                user.getEmail(), subject, "job-alert-digest", variables, rawVariables);

        for (JobSearchResult job : finalJobs) {
            if (!deliveryRepository.existsByAlertIdAndJobId(alert.getId(), job.id())) {
                JobAlertDelivery delivery =
                        JobAlertDelivery.builder()
                                .alertId(alert.getId())
                                .jobId(job.id())
                                .sentAt(Instant.now())
                                .build();
                deliveryRepository.save(delivery);
            }
        }

        alert.setLastSentAt(Instant.now());
        alertRepository.save(alert);

        eventPublisher.publishEvent(
                new JobAlertMatchedEvent(alert.getId(), alert.getUserId(), finalJobs.size()));
        return true;
    }

    /**
     * The email has only {@value #MAX_JOBS_PER_EMAIL} slots. Companies holding an alert-priority
     * slot take the front of the queue, and one slot is spent for each job that actually ships.
     */
    private List<JobSearchResult> pickWithPaidPriority(List<JobSearchResult> candidates) {
        Map<String, Long> companyIdByJob = companyIdsOf(candidates);
        Set<Long> prioritised =
                entitlementService.companiesWithAlertPush(new HashSet<>(companyIdByJob.values()));

        List<JobSearchResult> ordered =
                candidates.stream()
                        .sorted(
                                Comparator.comparing(
                                        (JobSearchResult job) ->
                                                prioritised.contains(companyIdByJob.get(job.id()))
                                                        ? 0
                                                        : 1))
                        .toList();

        List<JobSearchResult> picked = ordered.stream().limit(MAX_JOBS_PER_EMAIL).toList();
        for (JobSearchResult job : picked) {
            Long companyId = companyIdByJob.get(job.id());
            if (companyId != null && prioritised.contains(companyId)) {
                entitlementService.consumeAlertPush(companyId, toJobId(job.id()));
            }
        }
        return picked;
    }

    private Map<String, Long> companyIdsOf(List<JobSearchResult> candidates) {
        Map<Long, String> rawIds = new LinkedHashMap<>();
        for (JobSearchResult job : candidates) {
            Long jobId = toJobId(job.id());
            if (jobId != null) {
                rawIds.put(jobId, job.id());
            }
        }
        if (rawIds.isEmpty()) {
            return Map.of();
        }
        Map<Long, Long> companyByJobId = publicJobService.findCompanyIdsByJobIds(rawIds.keySet());
        Map<String, Long> result = new LinkedHashMap<>();
        companyByJobId.forEach((jobId, companyId) -> result.put(rawIds.get(jobId), companyId));
        return result;
    }

    private Long toJobId(String rawId) {
        try {
            return Long.valueOf(rawId);
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private String renderJobCards(List<JobSearchResult> jobs) {
        StringBuilder sb = new StringBuilder();
        String frontendUrl =
                appProperties.frontendUrl() != null
                        ? appProperties.frontendUrl()
                        : "https://intervue.app";

        for (JobSearchResult job : jobs) {
            String path =
                    job.detailUrl() != null && job.detailUrl().startsWith("/")
                            ? job.detailUrl()
                            : "/"
                                    + (job.detailUrl() != null
                                            ? job.detailUrl()
                                            : "jobs/" + job.id());
            String jobUrl = frontendUrl + path;

            sb.append(
                    "<div style=\"background-color: #fafbfc; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 18px; margin-bottom: 14px;\">");
            sb.append(
                    "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse: collapse;\">");
            sb.append("<tr><td>");
            sb.append("<a href=\"")
                    .append(jobUrl)
                    .append(
                            "\" target=\"_blank\" style=\"color: #111827; font-size: 16px; font-weight: bold; text-decoration: none; font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;\">");
            sb.append(HtmlUtils.htmlEscape(job.title()));
            sb.append("</a>");
            sb.append("</td></tr>");
            sb.append(
                    "<tr><td style=\"padding-top: 4px; color: #4b5563; font-size: 14px; font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;\">");
            sb.append(HtmlUtils.htmlEscape(job.company()));
            sb.append(" &bull; <span style=\"color: #6b7280;\">")
                    .append(HtmlUtils.htmlEscape(job.location()))
                    .append("</span>");
            sb.append("</td></tr>");
            sb.append("<tr><td style=\"padding-top: 8px;\">");
            sb.append(
                    "<span style=\"display: inline-block; background-color: #e6f7ef; color: #009d4f; font-size: 13px; font-weight: 600; padding: 3px 10px; border-radius: 6px; font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;\">");
            sb.append(HtmlUtils.htmlEscape(job.salary()));
            sb.append("</span>");

            if (job.level() != null && !job.level().isBlank()) {
                sb.append(
                        " <span style=\"display: inline-block; background-color: #f3f4f6; color: #374151; font-size: 12px; font-weight: 500; padding: 3px 8px; border-radius: 6px; font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;\">");
                sb.append(HtmlUtils.htmlEscape(job.level()));
                sb.append("</span>");
            }

            sb.append("</td></tr>");
            sb.append("<tr><td style=\"padding-top: 10px;\">");

            if (job.skills() != null) {
                for (String skill : job.skills().stream().limit(4).toList()) {
                    sb.append(
                            "<span style=\"display: inline-block; background-color: #f3f4f6; color: #4b5563; font-size: 12px; padding: 2px 8px; border-radius: 4px; margin-right: 4px; margin-bottom: 4px; font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;\">");
                    sb.append(HtmlUtils.htmlEscape(skill));
                    sb.append("</span>");
                }
            }

            sb.append("</td></tr>");
            sb.append("<tr><td style=\"padding-top: 12px;\">");
            sb.append("<a href=\"")
                    .append(jobUrl)
                    .append(
                            "\" target=\"_blank\" style=\"display: inline-block; padding: 7px 18px; background-color: #009d4f; color: #ffffff; font-size: 13px; font-weight: bold; text-decoration: none; border-radius: 6px; font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;\">");
            sb.append("View & Apply &rarr;");
            sb.append("</a>");
            sb.append("</td></tr>");
            sb.append("</table>");
            sb.append("</div>");
        }

        return sb.toString();
    }
}
