package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import com.techx.intervue.modules.user.events.EmailChangeRequestedEvent;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.requests.ChangeEmailRequest;
import com.techx.intervue.modules.user.services.interfaces.EmailChangeServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.EmailSendLimiterInterface;
import com.techx.intervue.modules.user.services.interfaces.OneTimeTokenServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserSessionCacheInterface;
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
public class EmailChangeService implements EmailChangeServiceInterface {

    private static final String CHANGE_ROUTE = "change-email";
    private static final String ATTEMPT_ROUTE = "change-email-attempt";
    private static final Duration ATTEMPT_COOLDOWN = Duration.ofSeconds(1);
    private static final String EMAIL_CHANGED_REASON = "EMAIL_CHANGED";

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OneTimeTokenServiceInterface oneTimeTokenService;
    private final EmailSendLimiterInterface emailSendLimiter;
    private final UserSessionCacheInterface userSessionCache;
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redis;
    private final TokenHashUtil tokenHashUtil;
    private final RateLimitServiceInterface rateLimitService;
    private final AuthFlowProperties properties;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public void request(Long userId, ChangeEmailRequest request, String ip) {
        rateLimitService.enforce(
                ATTEMPT_ROUTE,
                "user:" + userId,
                ATTEMPT_COOLDOWN,
                properties.loginFailThreshold(),
                properties.loginFailWindow());
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw AppException.validation("currentPassword", "Current password is incorrect!");
        }
        String newEmail = EmailHelper.normalize(request.newEmail());
        if (newEmail.equals(user.getEmail())) {
            throw AppException.validation(
                    "newEmail", "New email must be different from the current email!");
        }
        if (userRepository.existsByEmail(newEmail)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
        }
        emailSendLimiter.check(CHANGE_ROUTE, user.getEmail(), ip);
        eventPublisher.publishEvent(
                new EmailChangeRequestedEvent(
                        user.getId(), user.getName(), user.getEmail(), newEmail));
    }

    @Override
    @Transactional
    public void confirm(String token) {
        Long userId =
                oneTimeTokenService
                        .peek(OneTimeTokenPurpose.EMAIL_CHANGE, token)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        String newEmail = redis.opsForValue().get(pendingKey(token));
        if (newEmail == null) {
            throw new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN);
        }
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        if (userRepository.existsByEmail(newEmail)) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_USED);
        }
        oneTimeTokenService
                .consume(OneTimeTokenPurpose.EMAIL_CHANGE, token)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        user.setEmail(newEmail);
        user.setEmailVerifiedAt(Instant.now());
        redis.delete(pendingKey(token));
        refreshTokenRepository.revokeAllByUserId(userId, Instant.now(), EMAIL_CHANGED_REASON);
        userSessionCache.evict(userId);
    }

    private String pendingKey(String token) {
        return OneTimeTokenPurpose.EMAIL_CHANGE.getKeyPrefix()
                + "pending:"
                + tokenHashUtil.hash(token);
    }
}
