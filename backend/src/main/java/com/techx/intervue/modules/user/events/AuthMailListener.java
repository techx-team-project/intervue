package com.techx.intervue.modules.user.events;

import com.techx.intervue.config.AppProperties;
import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import com.techx.intervue.modules.user.services.interfaces.OneTimeTokenServiceInterface;
import com.techx.intervue.services.interfaces.MailServiceInterface;
import java.time.Duration;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class AuthMailListener {

    private final OneTimeTokenServiceInterface oneTimeTokenService;
    private final MailServiceInterface mailService;
    private final AppProperties appProperties;
    private final AuthFlowProperties authFlowProperties;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onEmailVerificationRequested(EmailVerificationRequestedEvent event) {
        String token =
                oneTimeTokenService.issue(OneTimeTokenPurpose.EMAIL_VERIFICATION, event.userId());
        mailService.sendHtml(
                event.email(),
                "Xác minh email tài khoản InterVue",
                "verify-email",
                Map.of(
                        "name", event.name(),
                        "link", link("/verify-email", token),
                        "expiry", describe(authFlowProperties.emailVerificationTtl())));
    }

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onPasswordResetRequested(PasswordResetRequestedEvent event) {
        String token =
                oneTimeTokenService.issue(OneTimeTokenPurpose.PASSWORD_RESET, event.userId());
        mailService.sendHtml(
                event.email(),
                "Đặt lại mật khẩu tài khoản InterVue",
                "reset-password",
                Map.of(
                        "name", event.name(),
                        "link", link("/reset-password", token),
                        "expiry", describe(authFlowProperties.passwordResetTtl())));
    }

    private String link(String path, String token) {
        return appProperties.frontendUrl() + path + "?token=" + token;
    }

    private String describe(Duration ttl) {
        return ttl.toHours() >= 1 ? ttl.toHours() + " hour" : ttl.toMinutes() + " minute";
    }
}
