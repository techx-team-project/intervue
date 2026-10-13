package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.services.interfaces.LoginAttemptServiceInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginAttemptService implements LoginAttemptServiceInterface {

    private static final String PREFIX = "auth:login-fail:";

    private final StringRedisTemplate redis;
    private final TokenHashUtil tokenHashUtil;
    private final AuthFlowProperties properties;

    @Override
    public void recordFailure(String email, String ip) {
        for (String key : keys(email, ip)) {
            Long count = redis.opsForValue().increment(key);
            if (count != null && count == 1) {
                redis.expire(key, properties.loginFailWindow());
            }
        }
    }

    @Override
    public boolean isCaptchaRequired(String email, String ip) {
        return keys(email, ip).stream().anyMatch(this::reachedThreshold);
    }

    @Override
    public void reset(String email, String ip) {
        redis.delete(keys(email, ip));
    }

    private boolean reachedThreshold(String key) {
        String value = redis.opsForValue().get(key);
        return value != null && Long.parseLong(value) >= properties.loginFailThreshold();
    }

    private List<String> keys(String email, String ip) {
        return List.of(PREFIX + "email:" + tokenHashUtil.hash(email), PREFIX + "ip:" + ip);
    }
}
