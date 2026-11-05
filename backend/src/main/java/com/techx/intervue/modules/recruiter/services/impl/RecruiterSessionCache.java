package com.techx.intervue.modules.recruiter.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterSessionCacheInterface;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecruiterSessionCache implements RecruiterSessionCacheInterface {

    private static final String KEY_PREFIX = "recruiter:session:";

    private final RedisTemplate<String, String> redis;
    private final ObjectMapper objectMapper;

    @Override
    public void set(Long recruiterId, String email, Duration ttl) {
        set(recruiterId, email, 1, ttl);
    }

    @Override
    public void set(Long recruiterId, String email, Integer tokenVersion, Duration ttl) {
        try {
            redis.opsForValue()
                    .set(
                            KEY_PREFIX + recruiterId,
                            objectMapper.writeValueAsString(
                                    new SessionData(
                                            email, tokenVersion != null ? tokenVersion : 1)),
                            ttl);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Unable to store recruiter session in redis", e);
        }
    }

    @Override
    public SessionData get(Long recruiterId) {
        String raw = redis.opsForValue().get(KEY_PREFIX + recruiterId);
        if (raw == null) {
            return null;
        }
        try {
            return objectMapper.readValue(raw, SessionData.class);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    @Override
    public void evict(Long recruiterId) {
        redis.delete(KEY_PREFIX + recruiterId);
    }
}
