package com.techx.intervue.modules.application.events;

import com.techx.intervue.config.AppProperties;
import com.techx.intervue.modules.application.entities.Application;
import com.techx.intervue.modules.application.entities.Interview;
import com.techx.intervue.modules.application.enums.InterviewEventType;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.application.repositories.InterviewRepository;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import com.techx.intervue.services.interfaces.MailServiceInterface;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class InterviewEventListener {

    private static final String TEMPLATE = "interview-update";
    private static final String CANDIDATE_PATH = "/candidate/interviews";
    private static final String RECRUITER_APPLICATION_PATH = "/recruiter/applications/";
    private static final String NO_NOTE = "No additional notes.";
    private static final DateTimeFormatter WHEN =
            DateTimeFormatter.ofPattern("HH:mm, EEEE d MMMM yyyy", Locale.ENGLISH)
                    .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));
    private static final String ZONE_LABEL = " (GMT+7)";

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationPublisherInterface notificationPublisher;
    private final MailServiceInterface mailService;
    private final RecruiterServiceInterface recruiterService;
    private final AppProperties appProperties;

    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onInterviewEvent(InterviewEvent event) {
        Interview interview = interviewRepository.findById(event.interviewId()).orElse(null);
        if (interview == null) {
            return;
        }
        Application application =
                applicationRepository.findById(interview.getApplicationId()).orElse(null);
        if (application == null) {
            return;
        }
        Content content = contentOf(event.type(), interview, application);
        for (Recipient recipient : recipientsOf(event.type(), interview, application)) {
            deliver(recipient, content, interview, application);
        }
    }

    private List<Recipient> recipientsOf(
            InterviewEventType type, Interview interview, Application application) {
        Recipient candidate =
                new Recipient(
                        RecipientType.USER,
                        application.getCandidateId(),
                        application.getCandidateName(),
                        application.getCandidateEmail(),
                        CANDIDATE_PATH,
                        "View interview");
        return switch (type) {
            case INVITED, UPDATED, CANCELLED -> List.of(candidate);
            case REMINDER_24H, REMINDER_1H -> List.of(candidate, recruiterOf(interview));
            case CONFIRMED, DECLINED, RESCHEDULE_REQUESTED -> List.of(recruiterOf(interview));
        };
    }

    private Recipient recruiterOf(Interview interview) {
        RecruiterResource recruiter = recruiterService.getMe(interview.getScheduledBy());
        return new Recipient(
                RecipientType.RECRUITER,
                recruiter.id(),
                recruiter.name(),
                recruiter.email(),
                RECRUITER_APPLICATION_PATH + interview.getApplicationId(),
                "Open application");
    }

    private Content contentOf(
            InterviewEventType type, Interview interview, Application application) {
        String company = application.getCompanyName();
        String job = application.getJobTitle();
        String candidate = application.getCandidateName();
        return switch (type) {
            case INVITED ->
                    new Content(
                            NotificationType.INTERVIEW_INVITED,
                            "Interview invitation from " + company,
                            company
                                    + " invited you to interview for "
                                    + job
                                    + ". Please confirm the time or suggest another one.",
                            interview.getNote(),
                            "");
            case UPDATED ->
                    new Content(
                            NotificationType.INTERVIEW_UPDATED,
                            "Your interview with " + company + " was updated",
                            interview.getStatus() == InterviewStatus.CONFIRMED
                                    ? company
                                            + " accepted the time you suggested. Your interview is"
                                            + " confirmed."
                                    : company
                                            + " changed the interview details. Please confirm the new"
                                            + " time or suggest another one.",
                            interview.getNote(),
                            "");
            case CANCELLED ->
                    new Content(
                            NotificationType.INTERVIEW_CANCELLED,
                            "Your interview with " + company + " was cancelled",
                            company + " cancelled the interview for " + job + ".",
                            interview.getCancelReason(),
                            "");
            case CONFIRMED ->
                    new Content(
                            NotificationType.INTERVIEW_CONFIRMED,
                            candidate + " confirmed the interview",
                            candidate + " will attend the interview for " + job + ".",
                            null,
                            "");
            case DECLINED ->
                    new Content(
                            NotificationType.INTERVIEW_DECLINED,
                            candidate + " declined the interview",
                            candidate + " cannot attend the interview for " + job + ".",
                            interview.getCandidateMessage(),
                            "");
            case RESCHEDULE_REQUESTED ->
                    new Content(
                            NotificationType.INTERVIEW_RESCHEDULE_REQUESTED,
                            candidate + " asked to move the interview",
                            candidate
                                    + " cannot make it and suggested "
                                    + formatTime(interview.getProposedStartsAt())
                                    + ". Open the application to accept it or choose a new time.",
                            interview.getCandidateMessage(),
                            "");
            case REMINDER_24H ->
                    new Content(
                            NotificationType.INTERVIEW_REMINDER,
                            "Reminder: interview in 24 hours",
                            "Your interview for " + job + " at " + company + " starts in 24 hours.",
                            interview.getNote(),
                            "24 giờ");
            case REMINDER_1H ->
                    new Content(
                            NotificationType.INTERVIEW_REMINDER,
                            "Reminder: interview in 1 hour",
                            "Your interview for " + job + " at " + company + " starts in 1 hour.",
                            interview.getNote(),
                            "1 giờ");
        };
    }

    private void deliver(
            Recipient recipient, Content content, Interview interview, Application application) {
        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(recipient.type())
                        .recipientId(recipient.id())
                        .type(content.notificationType())
                        .params(
                                Map.of(
                                        "jobTitle", application.getJobTitle(),
                                        "companyName", application.getCompanyName(),
                                        "candidateName", application.getCandidateName(),
                                        "when", formatTime(interview.getStartsAt()),
                                        "lead", content.lead()))
                        .actionUrl(recipient.path())
                        .build());
        mailService.sendHtml(
                recipient.email(),
                content.subject(),
                TEMPLATE,
                Map.ofEntries(
                        Map.entry("subjectTitle", content.subject()),
                        Map.entry("name", recipient.name()),
                        Map.entry("headline", content.headline()),
                        Map.entry("position", application.getJobTitle()),
                        Map.entry("company", application.getCompanyName()),
                        Map.entry(
                                "when",
                                formatTime(interview.getStartsAt())
                                        + " · "
                                        + interview.getDurationMinutes()
                                        + " min"),
                        Map.entry("where", interview.getFormat() + " · " + interview.getLocation()),
                        Map.entry(
                                "message", content.message() == null ? NO_NOTE : content.message()),
                        Map.entry("link", appProperties.frontendUrl() + recipient.path()),
                        Map.entry("buttonLabel", recipient.buttonLabel()),
                        Map.entry("supportEmail", appProperties.supportEmail())));
    }

    private String formatTime(Instant instant) {
        return WHEN.format(instant) + ZONE_LABEL;
    }

    private record Recipient(
            RecipientType type,
            Long id,
            String name,
            String email,
            String path,
            String buttonLabel) {}

    private record Content(
            NotificationType notificationType,
            String subject,
            String headline,
            String message,
            String lead) {}
}
