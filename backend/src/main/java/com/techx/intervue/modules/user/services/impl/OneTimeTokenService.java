package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import com.techx.intervue.modules.user.services.interfaces.OneTimeTokenServiceInterface;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OneTimeTokenService implements OneTimeTokenServiceInterface {

    private static final int TOKEN_BYTES = 32;

    private final SecureRandom secureRandom = new SecureRandom();
    private final StringRedisTemplate redis;
    private final TokenHashUtil tokenHashUtil;
    private final AuthFlowProperties properties;

    @Override
    public String issue(OneTimeTokenPurpose purpose, Long userId) {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        String tokenHash = tokenHashUtil.hash(rawToken);
        Duration ttl = ttlOf(purpose);

        String pointerKey = pointerKey(purpose, userId);
        String previousHash = redis.opsForValue().get(pointerKey);
        if (previousHash != null) {
            redis.delete(tokenKey(purpose, previousHash));
        }
        redis.opsForValue().set(pointerKey, tokenHash, ttl);
        redis.opsForValue().set(tokenKey(purpose, tokenHash), userId.toString(), ttl);
        return rawToken;
    }

    @Override
    public Optional<Long> peek(OneTimeTokenPurpose purpose, String rawToken) {
        String value = redis.opsForValue().get(tokenKey(purpose, tokenHashUtil.hash(rawToken)));
        return Optional.ofNullable(value).map(Long::valueOf);
    }

    @Override
    public Optional<Long> consume(OneTimeTokenPurpose purpose, String rawToken) {
        String tokenHash = tokenHashUtil.hash(rawToken);
        String value = redis.opsForValue().getAndDelete(tokenKey(purpose, tokenHash));
        if (value == null) {
            return Optional.empty();
        }
        Long userId = Long.valueOf(value);
        String pointerKey = pointerKey(purpose, userId);
        if (tokenHash.equals(redis.opsForValue().get(pointerKey))) {
            redis.delete(pointerKey);
        }
        return Optional.of(userId);
    }

    private Duration ttlOf(OneTimeTokenPurpose purpose) {
        return switch (purpose) {
            case EMAIL_VERIFICATION -> properties.emailVerificationTtl();
            case PASSWORD_RESET -> properties.passwordResetTtl();
        };
    }

    private String tokenKey(OneTimeTokenPurpose purpose, String tokenHash) {
        return purpose.getKeyPrefix() + "token:" + tokenHash;
    }

    private String pointerKey(OneTimeTokenPurpose purpose, Long userId) {
        return purpose.getKeyPrefix() + "user:" + userId;
    }
}
