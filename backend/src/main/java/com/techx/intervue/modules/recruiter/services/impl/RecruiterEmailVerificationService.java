package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.events.RecruiterEmailVerificationRequestedEvent;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterEmailVerificationServiceInterface;
import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import com.techx.intervue.modules.user.services.interfaces.EmailSendLimiterInterface;
import com.techx.intervue.modules.user.services.interfaces.OneTimeTokenServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterEmailVerificationService
        implements RecruiterEmailVerificationServiceInterface {

    private static final String RESEND_ROUTE = "recruiter-resend-verification";

    private final RecruiterRepository recruiterRepository;
    private final OneTimeTokenServiceInterface oneTimeTokenService;
    private final EmailSendLimiterInterface emailSendLimiter;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public void verify(String token) {
        Long recruiterId =
                oneTimeTokenService
                        .consume(OneTimeTokenPurpose.RECRUITER_EMAIL_VERIFICATION, token)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        if (!recruiter.isEmailVerified()) {
            recruiter.setEmailVerifiedAt(Instant.now());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public void resend(Long recruiterId, String ip) {
        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        if (recruiter.isEmailVerified()) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_VERIFIED);
        }
        emailSendLimiter.check(RESEND_ROUTE, recruiter.getEmail(), ip);
        eventPublisher.publishEvent(
                new RecruiterEmailVerificationRequestedEvent(
                        recruiter.getId(), recruiter.getEmail(), recruiter.getName()));
    }
}
