package com.techx.intervue.common.oauth;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.CookieHelper;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import java.util.function.Function;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthStateStore implements OAuthStateStoreInterface {

    private static final Duration STATE_TTL = CookieHelper.OAUTH_STATE_MAX_AGE;
    private static final int RANDOM_BYTES = 32;
    private static final String FIELD_SEPARATOR = "|";

    private final StringRedisTemplate redis;
    private final TokenHashUtil tokenHashUtil;
    private final SecureRandom random = new SecureRandom();

    @Override
    public IssuedAuthorization issue(
            String keyPrefix,
            String provider,
            boolean acceptTerms,
            Function<String, String> authorizationUrlFor) {
        String state = randomToken();
        String nonce = randomToken();
        String authorizationUrl = authorizationUrlFor.apply(state);
        redis.opsForValue()
                .set(
                        keyPrefix + state,
                        String.join(
                                FIELD_SEPARATOR,
                                provider,
                                String.valueOf(acceptTerms),
                                tokenHashUtil.hash(nonce)),
                        STATE_TTL);
        return new IssuedAuthorization(authorizationUrl, nonce);
    }

    @Override
    public boolean consume(String keyPrefix, String provider, String state, String nonce) {
        String stored = redis.opsForValue().getAndDelete(keyPrefix + state);
        if (stored == null || nonce == null || nonce.isBlank()) {
            throw new AppException(ErrorCode.OAUTH_STATE_INVALID);
        }
        String[] parts = stored.split("\\" + FIELD_SEPARATOR, 3);
        if (parts.length != 3
                || !provider.equals(parts[0])
                || !MessageDigest.isEqual(
                        parts[2].getBytes(StandardCharsets.UTF_8),
                        tokenHashUtil.hash(nonce).getBytes(StandardCharsets.UTF_8))) {
            throw new AppException(ErrorCode.OAUTH_STATE_INVALID);
        }
        return Boolean.parseBoolean(parts[1]);
    }

    private String randomToken() {
        byte[] bytes = new byte[RANDOM_BYTES];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
