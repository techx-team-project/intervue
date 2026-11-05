package com.techx.intervue.modules.recruiter.services.impl;

import com.techx.intervue.common.sms.SmsSenderInterface;
import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.recruiter.entities.Recruiter;
import com.techx.intervue.modules.recruiter.mappers.RecruiterMapper;
import com.techx.intervue.modules.recruiter.repositories.RecruiterRepository;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterPhoneVerificationServiceInterface;
import com.techx.intervue.modules.user.requests.SendPhoneOtpRequest;
import com.techx.intervue.modules.user.requests.VerifyPhoneOtpRequest;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RecruiterPhoneVerificationService
        implements RecruiterPhoneVerificationServiceInterface {

    private static final String KEY_PREFIX = "auth:recruiter-phone-otp:";
    private static final String SEND_ROUTE = "recruiter-phone-otp-send";
    private static final int OTP_BOUND = 1_000_000;
    private static final String OTP_FORMAT = "%06d";
    private static final String FIELD_SEPARATOR = "|";

    private final RecruiterRepository recruiterRepository;
    private final StringRedisTemplate redis;
    private final SmsSenderInterface smsSender;
    private final TokenHashUtil tokenHashUtil;
    private final RateLimitServiceInterface rateLimitService;
    private final AuthFlowProperties properties;
    private final RecruiterMapper recruiterMapper;
    private final SecureRandom random = new SecureRandom();

    @Override
    public void sendOtp(Long recruiterId, SendPhoneOtpRequest request, String ip) {
        Recruiter recruiter = requireRecruiter(recruiterId);
        String phone = request.phone();

        if (phone.equals(recruiter.getPhone()) && recruiter.isPhoneVerified()) {
            throw new AppException(ErrorCode.PHONE_ALREADY_VERIFIED);
        }
        if (recruiterRepository.existsByPhoneAndIdNot(phone, recruiterId)) {
            throw new AppException(ErrorCode.PHONE_ALREADY_USED);
        }

        rateLimitService.enforce(
                SEND_ROUTE,
                "recruiter:" + recruiterId,
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
                        key(recruiterId),
                        tokenHashUtil.hash(code) + FIELD_SEPARATOR + phone + FIELD_SEPARATOR + "0",
                        properties.phoneOtpTtl());

        smsSender.send(phone, "InterVue verification code: " + code);
    }

    @Override
    @Transactional
    public RecruiterResource verifyOtp(Long recruiterId, VerifyPhoneOtpRequest request, String ip) {
        String stored = redis.opsForValue().get(key(recruiterId));
        if (stored == null) {
            throw new AppException(ErrorCode.PHONE_OTP_NOT_REQUESTED);
        }

        String[] parts = stored.split("\\" + FIELD_SEPARATOR, 3);
        if (parts.length != 3) {
            redis.delete(key(recruiterId));
            throw new AppException(ErrorCode.PHONE_OTP_NOT_REQUESTED);
        }

        if (!matches(parts[0], request.code())) {
            registerFailedAttempt(recruiterId, parts);
        }

        Recruiter recruiter = requireRecruiter(recruiterId);
        String phone = parts[1];
        if (recruiterRepository.existsByPhoneAndIdNot(phone, recruiterId)) {
            throw new AppException(ErrorCode.PHONE_ALREADY_USED);
        }

        recruiter.setPhone(phone);
        recruiter.setPhoneVerifiedAt(Instant.now());
        redis.delete(key(recruiterId));

        return recruiterMapper.toResource(recruiter);
    }

    private void registerFailedAttempt(Long recruiterId, String[] parts) {
        int attempts = Integer.parseInt(parts[2]) + 1;
        if (attempts >= properties.phoneOtpMaxAttempts()) {
            redis.delete(key(recruiterId));
            throw AppException.phoneOtpAttemptsExceeded();
        }
        Long remaining = redis.getExpire(key(recruiterId), TimeUnit.SECONDS);
        if (remaining == null || remaining <= 0) {
            redis.delete(key(recruiterId));
            throw AppException.phoneOtpAttemptsExceeded();
        }
        redis.opsForValue()
                .set(
                        key(recruiterId),
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

    private Recruiter requireRecruiter(Long recruiterId) {
        return recruiterRepository
                .findById(recruiterId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private String key(Long recruiterId) {
        return KEY_PREFIX + recruiterId;
    }
}
