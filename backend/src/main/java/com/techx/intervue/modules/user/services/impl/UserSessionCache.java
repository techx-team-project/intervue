package com.techx.intervue.modules.user.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.services.interfaces.UserSessionCacheInterface;
import java.time.Duration;
import java.util.Set;
import lombok.AllArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserSessionCache implements UserSessionCacheInterface {

    private final RedisTemplate<String, String> redis;
    private final ObjectMapper objectMapper;
    private static final String KEY_PREFIX = "user:session:";

    @Override
    public void set(Long userId, String email, Set<RoleType> roles, Duration ttl) {
        set(userId, email, roles, 1, ttl);
    }

    @Override
    public void set(
            Long userId, String email, Set<RoleType> roles, Integer tokenVersion, Duration ttl) {
        String key = KEY_PREFIX + userId;
        try {
            redis.opsForValue()
                    .set(
                            key,
                            objectMapper.writeValueAsString(
                                    new SessionData(
                                            email, roles, tokenVersion != null ? tokenVersion : 1)),
                            ttl);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Không thể lưu session vào redis!", e);
        }
    }

    @Override
    public SessionData get(Long userId) {
        String key = KEY_PREFIX + userId;
        String raw = redis.opsForValue().get(key);
        if (raw == null) return null;
        try {
            return objectMapper.readValue(raw, SessionData.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Override
    public void evict(Long userId) {
        redis.delete(KEY_PREFIX + userId);
    }
}
