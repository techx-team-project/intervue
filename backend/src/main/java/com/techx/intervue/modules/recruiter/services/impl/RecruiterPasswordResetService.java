package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.events.RecruiterPasswordResetRequestedEvent;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRefreshTokenRepository;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterPasswordResetServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterSessionCacheInterface;
import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import com.techx.intervue.modules.user.requests.ForgotPasswordRequest;
import com.techx.intervue.modules.user.requests.ResetPasswordRequest;
import com.techx.intervue.modules.user.services.interfaces.EmailSendLimiterInterface;
import com.techx.intervue.modules.user.services.interfaces.OneTimeTokenServiceInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterPasswordResetService implements RecruiterPasswordResetServiceInterface {

    private static final String FORGOT_ROUTE = "recruiter-forgot-password";
    private static final String REVOKE_REASON = "PASSWORD_RESET";

    private final RecruiterRepository recruiterRepository;
    private final RecruiterRefreshTokenRepository refreshTokenRepository;
    private final OneTimeTokenServiceInterface oneTimeTokenService;
    private final EmailSendLimiterInterface emailSendLimiter;
    private final PasswordEncoder passwordEncoder;
    private final RecruiterSessionCacheInterface sessionCache;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public void forgot(ForgotPasswordRequest request, String ip) {
        String email = EmailHelper.normalize(request.email());
        emailSendLimiter.check(FORGOT_ROUTE, email, ip);
        recruiterRepository
                .findByEmail(email)
                .ifPresent(
                        recruiter ->
                                eventPublisher.publishEvent(
                                        new RecruiterPasswordResetRequestedEvent(
                                                recruiter.getId(),
                                                recruiter.getEmail(),
                                                recruiter.getName())));
    }

    @Override
    @Transactional
    public void reset(ResetPasswordRequest request) {
        Long recruiterId =
                oneTimeTokenService
                        .peek(OneTimeTokenPurpose.RECRUITER_PASSWORD_RESET, request.token())
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        if (!request.password().equals(request.confirmPassword())) {
            throw AppException.validation("confirmPassword", "Confirm password does not match!");
        }
        if (request.password().equalsIgnoreCase(recruiter.getEmail())) {
            throw AppException.validation(
                    "password", "Password must not be the same as the email!");
        }

        oneTimeTokenService
                .consume(OneTimeTokenPurpose.RECRUITER_PASSWORD_RESET, request.token())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));

        recruiter.setPassword(passwordEncoder.encode(request.password()));
        refreshTokenRepository.revokeAllByRecruiterId(
                recruiter.getId(), Instant.now(), REVOKE_REASON);
        sessionCache.evict(recruiter.getId());
    }
}
