package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.sms.SmsSenderInterface;
import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.mappers.UserMapper;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.requests.SendPhoneOtpRequest;
import com.techx.intervue.modules.user.requests.VerifyPhoneOtpRequest;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.PhoneVerificationServiceInterface;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PhoneVerificationService implements PhoneVerificationServiceInterface {

    private static final String KEY_PREFIX = "auth:phone-otp:";
    private static final String SEND_ROUTE = "phone-otp-send";
    private static final int OTP_BOUND = 1_000_000;
    private static final String OTP_FORMAT = "%06d";
    private static final String FIELD_SEPARATOR = "|";

    private final UserRepository userRepository;
    private final StringRedisTemplate redis;
    private final SmsSenderInterface smsSender;
    private final TokenHashUtil tokenHashUtil;
    private final RateLimitServiceInterface rateLimitService;
    private final AuthFlowProperties properties;
    private final AuditLogServiceInterface auditLogService;
    private final UserMapper userMapper;
    private final SecureRandom random = new SecureRandom();

    // Deliberately not transactional: delivering the SMS is an external call and must not hold a
    // database transaction open.
    @Override
    public void sendOtp(Long userId, SendPhoneOtpRequest request, String ip) {
        User user = requireUser(userId);
        String phone = request.phone();

        if (phone.equals(user.getPhone()) && user.getPhoneVerifiedAt() != null) {
            throw new AppException(ErrorCode.PHONE_ALREADY_VERIFIED);
        }
        if (userRepository.existsByPhoneAndIdNot(phone, userId)) {
            throw new AppException(ErrorCode.PHONE_ALREADY_USED);
        }

        rateLimitService.enforce(
                SEND_ROUTE,
                "user:" + userId,
                properties.resendCooldown(),
                properties.resendMaxAttempts(),
                properties.resendWindow());
        rateLimitService.enforce(
                SEND_ROUTE,
                "ip:" + ip,
                properties.resendCooldown(),
                properties.resendMaxAttempts(),
                properties.resendWindow());

        String code = String.format(OTP_FORMAT, random.nextInt(OTP_BOUND));
        redis.opsForValue()
                .set(
                        key(userId),
                        tokenHashUtil.hash(code) + FIELD_SEPARATOR + phone + FIELD_SEPARATOR + "0",
                        properties.phoneOtpTtl());

        smsSender.send(phone, "InterVue verification code: " + code);
    }

    @Override
    @Transactional
    public UserResource verifyOtp(Long userId, VerifyPhoneOtpRequest request, String ip) {
        String stored = redis.opsForValue().get(key(userId));
        if (stored == null) {
            throw new AppException(ErrorCode.PHONE_OTP_NOT_REQUESTED);
        }

        String[] parts = stored.split("\\" + FIELD_SEPARATOR, 3);
        if (parts.length != 3) {
            redis.delete(key(userId));
            throw new AppException(ErrorCode.PHONE_OTP_NOT_REQUESTED);
        }

        if (!matches(parts[0], request.code())) {
            registerFailedAttempt(userId, parts);
        }

        User user = requireUser(userId);
        String phone = parts[1];
        if (userRepository.existsByPhoneAndIdNot(phone, userId)) {
            throw new AppException(ErrorCode.PHONE_ALREADY_USED);
        }

        user.setPhone(phone);
        user.setPhoneVerifiedAt(Instant.now());
        redis.delete(key(userId));

        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.USER)
                        .actorId(userId)
                        .actorEmail(user.getEmail())
                        .action(AuditAction.PHONE_VERIFIED)
                        .targetType(AuditTargetType.USER)
                        .targetId(userId)
                        .ip(ip)
                        .build());

        return userMapper.toResource(user);
    }

    // A wrong code burns one of a small number of tries, so the 5-minute window cannot be used to
    // walk through all six-digit codes even though resending is itself rate limited.
    private void registerFailedAttempt(Long userId, String[] parts) {
        int attempts = Integer.parseInt(parts[2]) + 1;
        if (attempts >= properties.phoneOtpMaxAttempts()) {
            redis.delete(key(userId));
            throw AppException.phoneOtpAttemptsExceeded();
        }
        Long remaining = redis.getExpire(key(userId), TimeUnit.SECONDS);
        if (remaining == null || remaining <= 0) {
            redis.delete(key(userId));
            throw AppException.phoneOtpAttemptsExceeded();
        }
        redis.opsForValue()
                .set(
                        key(userId),
                        parts[0] + FIELD_SEPARATOR + parts[1] + FIELD_SEPARATOR + attempts,
                        Duration.ofSeconds(remaining));
        int remainingAttempts = properties.phoneOtpMaxAttempts() - attempts;
        throw AppException.phoneOtpInvalid(remainingAttempts);
    }

    private boolean matches(String storedHash, String code) {
        return MessageDigest.isEqual(
                storedHash.getBytes(StandardCharsets.UTF_8),
                tokenHashUtil.hash(code).getBytes(StandardCharsets.UTF_8));
    }

    private User requireUser(Long userId) {
        return userRepository
                .findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private String key(Long userId) {
        return KEY_PREFIX + userId;
    }
}
