package com.techx.intervue.modules.connect.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.common.net.PrivateNetworkGuard;
import com.techx.intervue.modules.connect.services.interfaces.LinkPreviewServiceInterface;
import java.io.IOException;
import java.net.InetAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LinkPreviewService implements LinkPreviewServiceInterface {

    private static final Pattern URL_PATTERN = Pattern.compile("https?://\\S+");
    private static final String CACHE_PREFIX = "connect:link-preview:v2:";
    private static final Duration CACHE_TTL = Duration.ofDays(7);
    private static final int TIMEOUT_MS = 2500;
    private static final int MAX_BODY_BYTES = 1_000_000;
    private static final int MAX_REDIRECTS = 3;
    private static final List<String> TITLE_SELECTORS =
            List.of("meta[property=og:title]", "meta[name=twitter:title]");
    private static final List<String> DESCRIPTION_SELECTORS =
            List.of(
                    "meta[property=og:description]",
                    "meta[name=twitter:description]",
                    "meta[name=description]");
    private static final List<String> IMAGE_META_SELECTORS =
            List.of(
                    "meta[property=og:image:secure_url]",
                    "meta[property=og:image]",
                    "meta[property=og:image:url]",
                    "meta[name=twitter:image]",
                    "meta[name=twitter:image:src]");
    private static final List<String> ICON_LINK_SELECTORS =
            List.of("link[rel=apple-touch-icon]", "link[rel='shortcut icon']", "link[rel=icon]");

    private final StringRedisTemplate redis;
    private final ObjectMapper objectMapper;

    @Override
    public Optional<LinkPreview> resolve(String text) {
        if (text == null || text.isBlank()) {
            return Optional.empty();
        }
        Matcher matcher = URL_PATTERN.matcher(text);
        if (!matcher.find()) {
            return Optional.empty();
        }
        String url = matcher.group().replaceAll("[.,;:!?)]+$", "");
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

    private Optional<LinkPreview> fetch(String initialUrl) {
        try {
            Connection.Response response = executeWithSafeRedirects(initialUrl);
            if (response == null || response.statusCode() < 200 || response.statusCode() >= 400) {
                return Optional.empty();
            }

            Document doc = response.parse();
            String title = firstMetaContent(doc, TITLE_SELECTORS).orElse(doc.title());
            String description = firstMetaContent(doc, DESCRIPTION_SELECTORS).orElse(null);
            String image = resolvePreviewImage(doc);

            if (isBlank(title) && isBlank(description) && isBlank(image)) {
                return Optional.empty();
            }
            return Optional.of(
                    LinkPreview.builder()
                            .url(initialUrl)
                            .title(trim(title, 255))
                            .description(trim(description, 500))
                            .imageUrl(trim(image, 500))
                            .build());
        } catch (Exception e) {
            log.debug("Link preview fetch failed for {}: {}", initialUrl, e.getMessage());
            return Optional.empty();
        }
    }

    private Connection.Response executeWithSafeRedirects(String initialUrl) throws IOException {
        String currentUrl = initialUrl;
        for (int hop = 0; hop <= MAX_REDIRECTS; hop++) {
            if (!isSafePublicHttpUrl(currentUrl)) {
                return null;
            }
            Connection.Response response =
                    Jsoup.connect(currentUrl)
                            .timeout(TIMEOUT_MS)
                            .maxBodySize(MAX_BODY_BYTES)
                            .followRedirects(false)
                            .ignoreHttpErrors(true)
                            .userAgent("InterVueLinkPreviewBot/1.0")
                            .execute();
            int status = response.statusCode();
            if (status >= 300 && status < 400) {
                String location = response.header("Location");
                if (isBlank(location)) {
                    return null;
                }
                currentUrl = URI.create(currentUrl).resolve(location.trim()).toString();
                continue;
            }
            return response;
        }
        return null;
    }

    private boolean isSafePublicHttpUrl(String candidateUrl) {
        try {
            URI uri = URI.create(candidateUrl);
            String scheme = uri.getScheme();
            String host = uri.getHost();
            if (scheme == null
                    || host == null
                    || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
                return false;
            }
            InetAddress[] addresses = InetAddress.getAllByName(host);
            if (addresses.length == 0) {
                return false;
            }
            for (InetAddress address : addresses) {
                if (PrivateNetworkGuard.isPrivateOrLocal(address)) {
                    return false;
                }
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Optional<String> firstMetaContent(Document doc, List<String> selectors) {
        for (String selector : selectors) {
            Element element = doc.selectFirst(selector);
            if (element != null) {
                String content = element.attr("content").trim();
                if (!content.isBlank()) {
                    return Optional.of(content);
                }
            }
        }
        return Optional.empty();
    }

    private String resolvePreviewImage(Document doc) {
        for (String selector : IMAGE_META_SELECTORS) {
            Element element = doc.selectFirst(selector);
            if (element != null) {
                String resolved = resolveAttrUrl(element, "content");
                if (resolved != null) {
                    return resolved;
                }
            }
        }
        for (String selector : ICON_LINK_SELECTORS) {
            Element element = doc.selectFirst(selector);
            if (element != null) {
                String resolved = resolveAttrUrl(element, "href");
                if (resolved != null) {
                    return resolved;
                }
            }
        }
        return null;
    }

    private String resolveAttrUrl(Element element, String attr) {
        String abs = element.absUrl(attr).trim();
        if (abs.isBlank()) {
            String raw = element.attr(attr).trim();
            if (raw.startsWith("http://") || raw.startsWith("https://")) {
                abs = raw;
            }
        }
        if (abs.isBlank()) {
            return null;
        }
        return isSafePublicHttpUrl(abs) ? abs : null;
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
