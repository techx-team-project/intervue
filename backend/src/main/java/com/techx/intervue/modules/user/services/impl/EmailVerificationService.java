package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import com.techx.intervue.modules.user.events.EmailVerificationRequestedEvent;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.services.interfaces.EmailSendLimiterInterface;
import com.techx.intervue.modules.user.services.interfaces.EmailVerificationServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.OneTimeTokenServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmailVerificationService implements EmailVerificationServiceInterface {

    private static final String RESEND_ROUTE = "resend-verification";

    private final UserRepository userRepository;
    private final OneTimeTokenServiceInterface oneTimeTokenService;
    private final EmailSendLimiterInterface emailSendLimiter;
    private final ApplicationEventPublisher eventPublisher;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional
    public void verify(String token) {
        Long userId =
                oneTimeTokenService
                        .consume(OneTimeTokenPurpose.EMAIL_VERIFICATION, token)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        if (!user.isEmailVerified()) {
            user.setEmailVerifiedAt(Instant.now());
            auditLogService.record(
                    AuditEntry.builder()
                            .actorType(AuditActorType.USER)
                            .actorId(user.getId())
                            .actorEmail(user.getEmail())
                            .action(AuditAction.EMAIL_VERIFIED)
                            .targetType(AuditTargetType.USER)
                            .targetId(user.getId())
                            .reason("Email address verified via token link")
                            .build());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public void resend(Long userId, String ip) {
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        if (user.isEmailVerified()) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }
        emailSendLimiter.check(RESEND_ROUTE, user.getEmail(), ip);
        eventPublisher.publishEvent(
                new EmailVerificationRequestedEvent(user.getId(), user.getEmail(), user.getName()));
    }
}
