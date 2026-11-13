package com.techx.intervue.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.ErrorResource;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private record Policy(String route, List<String> patterns, int max, Duration window) {}

    private static final AntPathMatcher MATCHER = new AntPathMatcher();

    private static final List<Policy> POLICIES =
            List.of(
                    new Policy(
                            "auth",
                            List.of(
                                    "/api/v1/auth/login",
                                    "/api/v1/auth/register",
                                    "/api/v1/auth/forgot-password",
                                    "/api/v1/auth/reset-password",
                                    "/api/v1/auth/verify-2fa",
                                    "/api/v1/admin/auth/login",
                                    "/api/v1/admin/auth/verify-2fa",
                                    "/api/v1/recruiter/auth/login",
                                    "/api/v1/recruiter/auth/register",
                                    "/api/v1/recruiter/auth/forgot-password",
                                    "/api/v1/recruiter/auth/reset-password",
                                    "/api/v1/recruiter/auth/verify-2fa"),
                            10,
                            Duration.ofMinutes(1)),
                    new Policy(
                            "ai",
                            List.of("/api/v1/ai/**", "/api/v1/recruiter/ai/**"),
                            20,
                            Duration.ofMinutes(1)),
                    // A voucher code is guessable, so this stays far below the generic API budget
                    new Policy(
                            "voucher",
                            List.of("/api/v1/recruiter/vouchers/validate"),
                            10,
                            Duration.ofMinutes(1)),
                    new Policy("api", List.of("/api/**"), 600, Duration.ofMinutes(1)));

    private final RateLimitServiceInterface rateLimitService;
    private final ObjectMapper objectMapper;

    public RateLimitFilter(RateLimitServiceInterface rateLimitService, ObjectMapper objectMapper) {
        this.rateLimitService = rateLimitService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        String subject = resolveSubject(request);
        for (Policy policy : POLICIES) {
            if (policy.patterns().stream().noneMatch(pattern -> MATCHER.match(pattern, path))) {
                continue;
            }
            long retryAfter = check(policy, subject);
            if (retryAfter > 0) {
                reject(response, retryAfter);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    // Redis outage must not take the whole API down.
    private long check(Policy policy, String subject) {
        try {
            return rateLimitService.retryAfterSeconds(
                    policy.route(), subject, policy.max(), policy.window());
        } catch (RuntimeException e) {
            log.warn("Rate limit check skipped for route {}: {}", policy.route(), e.getMessage());
            return 0;
        }
    }

    private String resolveSubject(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null
                && authentication.getPrincipal() instanceof CustomUserDetails user) {
            boolean recruiter =
                    authentication.getAuthorities().stream()
                            .anyMatch(a -> "ROLE_RECRUITER".equals(a.getAuthority()));
            return (recruiter ? "r:" : "u:") + user.getId();
        }
        return "ip:" + IpHelper.getClientIp(request);
    }

    private void reject(HttpServletResponse response, long retryAfter) throws IOException {
        ErrorResource error = ErrorResource.builder().code(ErrorCode.RATE_LIMITED.name()).build();
        response.setStatus(ErrorCode.RATE_LIMITED.getStatus().value());
        response.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(retryAfter));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter()
                .write(
                        objectMapper.writeValueAsString(
                                ApiResource.error(error, ErrorCode.RATE_LIMITED.getMessage())));
    }
}
