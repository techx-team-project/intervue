package com.techx.intervue.modules.ai.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.ai.resources.UserChatResponse;
import com.techx.intervue.modules.ai.services.interfaces.AiResponseCacheServiceInterface;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiResponseCacheService implements AiResponseCacheServiceInterface {

    private static final String CACHE_PREFIX = "ai:cache:public:";
    private static final Duration TTL_GENERAL = Duration.ofHours(6);
    private static final Duration TTL_JOBS = Duration.ofMinutes(15);

    private static final List<String> PRIVATE_KEYWORDS =
            List.of(
                    "của tôi",
                    "của toii",
                    "hồ sơ tôi",
                    "hồ sơ của tôi",
                    "cv của tôi",
                    "cv tôi",
                    "cv toi",
                    "ứng tuyển của tôi",
                    "đơn của tôi",
                    "so khớp cv",
                    "so khớp hồ sơ",
                    "khớp cv",
                    "viết thư cho tôi",
                    "thư ứng tuyển của tôi",
                    "my cv",
                    "my application",
                    "my applications",
                    "my profile");

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    @Override
    public Optional<UserChatResponse> get(String message) {
        if (message == null || message.isBlank() || isLikelyPrivate(message)) {
            return Optional.empty();
        }

        try {
            String cacheKey = buildCacheKey(message);
            String rawJson = redis.opsForValue().get(cacheKey);
            if (rawJson == null || rawJson.isBlank()) {
                return Optional.empty();
            }

            CachedResponse cached = objectMapper.readValue(rawJson, CachedResponse.class);
            log.info("Cross-user public cache HIT for query hash: {}", cacheKey);
            return Optional.of(new UserChatResponse(cached.answer(), cached.sources()));
        } catch (Exception ex) {
            log.warn("Failed to read cross-user cache: {}", ex.getMessage());
            return Optional.empty();
        }
    }

    @Override
    public void put(
            String message,
            UserChatResponse response,
            boolean containsPrivateData,
            boolean containsJobData) {
        if (message == null
                || message.isBlank()
                || response == null
                || response.answer() == null
                || response.answer().isBlank()
                || containsPrivateData
                || isLikelyPrivate(message)) {
            return;
        }

        try {
            String cacheKey = buildCacheKey(message);
            CachedResponse cached = new CachedResponse(response.answer(), response.sources());
            String json = objectMapper.writeValueAsString(cached);
            Duration ttl = containsJobData ? TTL_JOBS : TTL_GENERAL;

            redis.opsForValue().set(cacheKey, json, ttl);
            log.debug(
                    "Saved cross-user response to cache: {} (TTL: {} mins)",
                    cacheKey,
                    ttl.toMinutes());
        } catch (Exception ex) {
            log.warn("Failed to write to cross-user cache: {}", ex.getMessage());
        }
    }

    @Override
    public boolean isLikelyPrivate(String message) {
        if (message == null || message.isBlank()) {
            return false;
        }
        String lower = message.toLowerCase(Locale.ROOT);
        for (String kw : PRIVATE_KEYWORDS) {
            if (lower.contains(kw)) {
                return true;
            }
        }
        return false;
    }

    private String buildCacheKey(String message) {
        String normalized =
                message.toLowerCase(Locale.ROOT)
                        .replaceAll(
                                "[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ\\s]",
                                " ")
                        .replaceAll("\\s+", " ")
                        .trim();
        return CACHE_PREFIX + sha256(normalized);
    }

    private String sha256(String text) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(text.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException ex) {
            return Integer.toHexString(text.hashCode());
        }
    }

    public record CachedResponse(String answer, List<String> sources) {}
}
