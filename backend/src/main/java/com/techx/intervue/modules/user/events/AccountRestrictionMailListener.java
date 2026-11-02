package com.techx.intervue.modules.user.events;

import com.techx.intervue.config.AppProperties;
import com.techx.intervue.services.interfaces.MailServiceInterface;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class AccountRestrictionMailListener {

    private static final DateTimeFormatter LIFT_DATE =
            DateTimeFormatter.ofPattern("d MMM yyyy 'at' HH:mm")
                    .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

    private final MailServiceInterface mailService;
    private final AppProperties appProperties;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onAccountRestricted(AccountRestrictedEvent event) {
        mailService.sendHtml(
                event.email(),
                "Your InterVue account has been restricted",
                "account-banned",
                Map.of(
                        "name", event.name(),
                        "reason", event.reason(),
                        "duration", describeDuration(event.expiresAt()),
                        "supportEmail", appProperties.supportEmail()));
    }

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onAccountRestrictionLifted(AccountRestrictionLiftedEvent event) {
        mailService.sendHtml(
                event.email(),
                "Your InterVue account is active again",
                "account-unbanned",
                Map.of("name", event.name(), "link", appProperties.frontendUrl() + "/login"));
    }

    private String describeDuration(Instant expiresAt) {
        return expiresAt == null
                ? "The restriction does not have an end date."
                : "It lifts automatically on " + LIFT_DATE.format(expiresAt) + " (GMT+7).";
    }
}
