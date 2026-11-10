package com.techx.intervue.modules.connect.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.common.net.PrivateNetworkGuard;
import com.techx.intervue.modules.connect.services.interfaces.LinkPreviewServiceInterface;
import java.net.InetAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LinkPreviewService implements LinkPreviewServiceInterface {

    private static final Pattern URL_PATTERN = Pattern.compile("https?://\\S+");
    private static final String CACHE_PREFIX = "connect:link-preview:";
    private static final Duration CACHE_TTL = Duration.ofDays(7);
    private static final int TIMEOUT_MS = 2000;
    private static final int MAX_BODY_BYTES = 1_000_000;

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    @Override
    public Optional<LinkPreview> resolve(String text) {
        if (text == null) {
            return Optional.empty();
        }
        Matcher matcher = URL_PATTERN.matcher(text);
        if (!matcher.find()) {
            return Optional.empty();
        }
        String url = matcher.group();
        String cacheKey = CACHE_PREFIX + sha256(url);
        try {
            String cached = redis.opsForValue().get(cacheKey);
            if (cached != null) {
                return cached.isBlank() ? Optional.empty() : Optional.ofNullable(readJson(cached));
            }
        } catch (Exception e) {
            log.debug("Link preview cache lookup failed for {}: {}", url, e.getMessage());
        }

        Optional<LinkPreview> preview = fetch(url);
        try {
            redis.opsForValue().set(cacheKey, preview.map(this::writeJson).orElse(""), CACHE_TTL);
        } catch (Exception e) {
            log.debug("Link preview cache write failed for {}: {}", url, e.getMessage());
        }
        return preview;
    }

    private Optional<LinkPreview> fetch(String url) {
        try {
            URI uri = URI.create(url);
            InetAddress address = InetAddress.getByName(uri.getHost());
            if (PrivateNetworkGuard.isPrivateOrLocal(address)) {
                return Optional.empty();
            }

            Document doc =
                    Jsoup.connect(url)
                            .timeout(TIMEOUT_MS)
                            .maxBodySize(MAX_BODY_BYTES)
                            .followRedirects(false)
                            .userAgent("InterVueLinkPreviewBot/1.0")
                            .get();

            String title = metaOr(doc, "og:title", doc.title());
            String description = metaOr(doc, "og:description", null);
            String image = metaOr(doc, "og:image", null);
            if (isBlank(title) && isBlank(description) && isBlank(image)) {
                return Optional.empty();
            }
            return Optional.of(
                    LinkPreview.builder()
                            .url(url)
                            .title(trim(title, 255))
                            .description(trim(description, 500))
                            .imageUrl(image)
                            .build());
        } catch (Exception e) {
            log.debug("Link preview fetch failed for {}: {}", url, e.getMessage());
            return Optional.empty();
        }
    }

    private String metaOr(Document doc, String property, String fallback) {
        String content = doc.select("meta[property=" + property + "]").attr("content");
        return content.isBlank() ? fallback : content;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String trim(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private String writeJson(LinkPreview preview) {
        try {
            return objectMapper.writeValueAsString(preview);
        } catch (Exception e) {
            return "";
        }
    }

    private LinkPreview readJson(String json) {
        try {
            return objectMapper.readValue(json, LinkPreview.class);
        } catch (Exception e) {
            return null;
        }
    }
}
