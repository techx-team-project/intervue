package com.techx.intervue.common.geolocation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.net.InetAddress;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
@Slf4j
public class GeoLocationService implements GeoLocationServiceInterface {

    private static final String CACHE_PREFIX = "geo:ip:";
    private static final Duration CACHE_TTL = Duration.ofDays(30);

    private final StringRedisTemplate redisTemplate;
    private final RestClient restClient;

    public GeoLocationService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofMillis(1500));
        factory.setReadTimeout(Duration.ofMillis(1500));
        this.restClient =
                RestClient.builder()
                        .requestFactory(factory)
                        .baseUrl("http://ip-api.com/json/")
                        .build();
    }

    @Override
    public String resolveLocation(String ip) {
        if (ip == null || ip.isBlank()) {
            return "Unknown Location";
        }

        String trimmed = ip.trim();
        if (isPrivateOrLocal(trimmed)) {
            return "Local Network";
        }

        String cacheKey = CACHE_PREFIX + trimmed;
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return cached;
            }
        } catch (Exception e) {
            log.debug("Redis cache lookup failed for IP {}: {}", trimmed, e.getMessage());
        }

        String location = fetchLocationFromApi(trimmed);
        try {
            redisTemplate.opsForValue().set(cacheKey, location, CACHE_TTL);
        } catch (Exception e) {
            log.debug("Redis cache write failed for IP {}: {}", trimmed, e.getMessage());
        }

        return location;
    }

    private boolean isPrivateOrLocal(String ip) {
        if ("127.0.0.1".equals(ip)
                || "0:0:0:0:0:0:0:1".equals(ip)
                || "::1".equals(ip)
                || "localhost".equalsIgnoreCase(ip)) {
            return true;
        }
        try {
            InetAddress addr = InetAddress.ofLiteral(ip);
            return addr.isLoopbackAddress()
                    || addr.isSiteLocalAddress()
                    || addr.isLinkLocalAddress();
        } catch (IllegalArgumentException e) {
            return ip.startsWith("10.")
                    || ip.startsWith("192.168.")
                    || ip.startsWith("172.")
                    || ip.startsWith("169.254.");
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record IpApiResponse(String status, String country, String regionName, String city) {}

    private String fetchLocationFromApi(String ip) {
        try {
            IpApiResponse response =
                    restClient
                            .get()
                            .uri("{ip}?fields=status,country,regionName,city", ip)
                            .retrieve()
                            .body(IpApiResponse.class);

            if (response != null && "success".equalsIgnoreCase(response.status())) {
                if (response.city() != null
                        && !response.city().isBlank()
                        && response.country() != null) {
                    return response.city() + ", " + response.country();
                }
                if (response.country() != null && !response.country().isBlank()) {
                    return response.country();
                }
            }
        } catch (Exception e) {
            log.debug("Geo-IP lookup failed for IP {}: {}", ip, e.getMessage());
        }
        return "Unknown Location";
    }
}
