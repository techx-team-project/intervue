package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.events.RecruiterEmailChangeRequestedEvent;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRefreshTokenRepository;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterEmailChangeServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterSessionCacheInterface;
import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import com.techx.intervue.modules.user.requests.ChangeEmailRequest;
import com.techx.intervue.modules.user.services.interfaces.EmailSendLimiterInterface;
import com.techx.intervue.modules.user.services.interfaces.OneTimeTokenServiceInterface;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import java.time.Duration;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterEmailChangeService implements RecruiterEmailChangeServiceInterface {

    private static final String CHANGE_ROUTE = "recruiter-change-email";
    private static final String ATTEMPT_ROUTE = "recruiter-change-email-attempt";
    private static final Duration ATTEMPT_COOLDOWN = Duration.ofSeconds(1);
    private static final String EMAIL_CHANGED_REASON = "EMAIL_CHANGED";

    private final RecruiterRepository recruiterRepository;
    private final RecruiterRefreshTokenRepository refreshTokenRepository;
    private final OneTimeTokenServiceInterface oneTimeTokenService;
    private final EmailSendLimiterInterface emailSendLimiter;
    private final RecruiterSessionCacheInterface sessionCache;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redis;
    private final TokenHashUtil tokenHashUtil;
    private final RateLimitServiceInterface rateLimitService;
    private final AuthFlowProperties properties;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public void request(Long recruiterId, ChangeEmailRequest request, String ip) {
        rateLimitService.enforce(
                ATTEMPT_ROUTE,
                "recruiter:" + recruiterId,
                ATTEMPT_COOLDOWN,
                properties.loginFailThreshold(),
                properties.loginFailWindow());
        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        if (!passwordEncoder.matches(request.currentPassword(), recruiter.getPassword())) {
            throw AppException.validation("currentPassword", "Current password is incorrect!");
        }
        String newEmail = EmailHelper.normalize(request.newEmail());
        if (newEmail.equals(recruiter.getEmail())) {
            throw AppException.validation(
                    "newEmail", "New email must be different from the current email!");
        }
        if (recruiterRepository.existsByEmail(newEmail)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
        }
        emailSendLimiter.check(CHANGE_ROUTE, recruiter.getEmail(), ip);
        eventPublisher.publishEvent(
                new RecruiterEmailChangeRequestedEvent(
                        recruiter.getId(), recruiter.getName(), recruiter.getEmail(), newEmail));
    }

    @Override
    @Transactional
    public void confirm(String token) {
        Long recruiterId =
                oneTimeTokenService
                        .peek(OneTimeTokenPurpose.RECRUITER_EMAIL_CHANGE, token)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        String newEmail = redis.opsForValue().get(pendingKey(token));
        if (newEmail == null) {
            throw new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN);
        }
        Recruiter recruiter =
                recruiterRepository
                        .findById(recruiterId)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        if (recruiterRepository.existsByEmail(newEmail)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
        }
        oneTimeTokenService
                .consume(OneTimeTokenPurpose.RECRUITER_EMAIL_CHANGE, token)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        recruiter.setEmail(newEmail);
        recruiter.setEmailVerifiedAt(Instant.now());
        redis.delete(pendingKey(token));
        refreshTokenRepository.revokeAllByRecruiterId(
                recruiterId, Instant.now(), EMAIL_CHANGED_REASON);
        sessionCache.evict(recruiterId);
    }

    private String pendingKey(String token) {
        return OneTimeTokenPurpose.RECRUITER_EMAIL_CHANGE.getKeyPrefix()
                + "pending:"
                + tokenHashUtil.hash(token);
    }
}
