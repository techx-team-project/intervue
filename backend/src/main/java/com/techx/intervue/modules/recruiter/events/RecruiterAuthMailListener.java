package com.techx.intervue.modules.recruiter.events;

import com.techx.intervue.config.AppProperties;
import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import com.techx.intervue.modules.user.services.interfaces.OneTimeTokenServiceInterface;
import com.techx.intervue.services.interfaces.MailServiceInterface;
import java.time.Duration;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class RecruiterAuthMailListener {

    private final OneTimeTokenServiceInterface oneTimeTokenService;
    private final MailServiceInterface mailService;
    private final AppProperties appProperties;
    private final AuthFlowProperties authFlowProperties;
    private final StringRedisTemplate redis;
    private final TokenHashUtil tokenHashUtil;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onEmailVerificationRequested(RecruiterEmailVerificationRequestedEvent event) {
        String token =
                oneTimeTokenService.issue(
                        OneTimeTokenPurpose.RECRUITER_EMAIL_VERIFICATION, event.recruiterId());
        mailService.sendHtml(
                event.email(),
                "Xác minh email tài khoản InterVue",
                "verify-email",
                Map.of(
                        "name", event.name(),
                        "link", link("/recruiter/verify-email", token),
                        "expiry", describe(authFlowProperties.emailVerificationTtl())));
    }

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onPasswordResetRequested(RecruiterPasswordResetRequestedEvent event) {
        String token =
                oneTimeTokenService.issue(
                        OneTimeTokenPurpose.RECRUITER_PASSWORD_RESET, event.recruiterId());
        mailService.sendHtml(
                event.email(),
                "Đặt lại mật khẩu tài khoản InterVue",
                "reset-password",
                Map.of(
                        "name", event.name(),
                        "link", link("/recruiter/reset-password", token),
                        "expiry", describe(authFlowProperties.passwordResetTtl())));
    }

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onEmailChangeRequested(RecruiterEmailChangeRequestedEvent event) {
        String token =
                oneTimeTokenService.issue(
                        OneTimeTokenPurpose.RECRUITER_EMAIL_CHANGE, event.recruiterId());
        redis.opsForValue()
                .set(
                        OneTimeTokenPurpose.RECRUITER_EMAIL_CHANGE.getKeyPrefix()
                                + "pending:"
                                + tokenHashUtil.hash(token),
                        event.newEmail(),
                        authFlowProperties.emailVerificationTtl());
        mailService.sendHtml(
                event.newEmail(),
                "Confirm your new InterVue email",
                "change-email",
                Map.of(
                        "name", event.name(),
                        "newEmail", event.newEmail(),
                        "link", link("/recruiter/confirm-email-change", token),
                        "expiry", describe(authFlowProperties.emailVerificationTtl())));
        mailService.sendHtml(
                event.oldEmail(),
                "Your InterVue email change request",
                "email-change-notice",
                Map.of("name", event.name(), "newEmail", event.newEmail()));
    }

    private String link(String path, String token) {
        return appProperties.frontendUrl() + path + "?token=" + token;
    }

    private String describe(Duration ttl) {
        return ttl.toHours() >= 1 ? ttl.toHours() + " hour" : ttl.toMinutes() + " minute";
    }
}
