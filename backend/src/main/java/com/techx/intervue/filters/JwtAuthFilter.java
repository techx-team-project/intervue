package com.techx.intervue.filters;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterSessionCacheInterface;
import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.services.interfaces.JwtServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserSessionCacheInterface;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.ErrorResource;
import com.techx.intervue.services.interfaces.BlacklistServiceInterface;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtServiceInterface jwtService;
    private final BlacklistServiceInterface blacklistService;
    private final ObjectMapper objectMapper;
    private final UserSessionCacheInterface userSessionCache;
    private final RecruiterSessionCacheInterface recruiterSessionCache;

    private static final String RECRUITER_ROLE = "RECRUITER";

    public static final String TOKEN_ATTRIBUTE = "jwt_token";

    private static final Map<Class<? extends JwtException>, String> JWT_ERRORS_MESSAGES =
            Map.of(
                    MalformedJwtException.class, "Invalid token format",
                    ExpiredJwtException.class, "Token has expired",
                    SignatureException.class, "Token was not issued by this system",
                    UnsupportedJwtException.class, "Unsupported token type");

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        try {
            String purpose = jwtService.extractAllClaims(token).get("purp", String.class);
            if ("2FA_PREAUTH".equals(purpose)) {
                writeErrorResponse(
                        response,
                        "Pre-authentication token cannot be used to access protected resources.");
                return;
            }

            String jti = jwtService.extractJti(token);
            if (Boolean.TRUE.equals(blacklistService.isRevoked(jti))) {
                if ("/api/v1/ai/chat".equals(request.getRequestURI())) {
                    filterChain.doFilter(request, response);
                    return;
                }
                writeErrorResponse(response, "Your token is invalid.");
                return;
            }
            request.setAttribute(TOKEN_ATTRIBUTE, token);
            Long userId = jwtService.extractSubject(token);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                SessionIdentity session =
                        resolveSession(jwtService.extractAccountType(token), userId);

                if (session == null) {
                    if ("/api/v1/ai/chat".equals(request.getRequestURI())) {
                        filterChain.doFilter(request, response);
                        return;
                    }
                    writeErrorResponse(response, "Your session has expired.");
                    return;
                }

                Integer tokenVersion = jwtService.extractTokenVersion(token);
                int expectedVersion = session.tokenVersion() != null ? session.tokenVersion() : 1;
                int actualVersion = tokenVersion != null ? tokenVersion : 1;
                if (actualVersion != expectedVersion) {
                    if ("/api/v1/ai/chat".equals(request.getRequestURI())) {
                        filterChain.doFilter(request, response);
                        return;
                    }
                    writeErrorResponse(response, "Your session has been invalidated.");
                    return;
                }

                Set<GrantedAuthority> authorities = new HashSet<>();
                session.roles()
                        .forEach(r -> authorities.add(new SimpleGrantedAuthority("ROLE_" + r)));

                CustomUserDetails userDetails =
                        CustomUserDetails.builder()
                                .id(userId)
                                .email(session.email())
                                .authorities(authorities)
                                .build();

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (JwtException e) {
            if ("/api/v1/ai/chat".equals(request.getRequestURI())) {
                filterChain.doFilter(request, response);
                return;
            }
            String message =
                    JWT_ERRORS_MESSAGES.getOrDefault(e.getClass(), "Token authentication failed!");
            writeErrorResponse(response, message);
            return;

        } catch (Exception e) {
            if ("/api/v1/ai/chat".equals(request.getRequestURI())) {
                filterChain.doFilter(request, response);
                return;
            }
            writeErrorResponse(response, "Token authentication failed!");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private SessionIdentity resolveSession(AccountType accountType, Long accountId) {
        if (accountType == AccountType.RECRUITER) {
            RecruiterSessionCacheInterface.SessionData session =
                    recruiterSessionCache.get(accountId);
            return session == null
                    ? null
                    : new SessionIdentity(
                            session.email(), Set.of(RECRUITER_ROLE), session.tokenVersion());
        }
        UserSessionCacheInterface.SessionData session = userSessionCache.get(accountId);
        return session == null
                ? null
                : new SessionIdentity(
                        session.email(),
                        session.roles().stream().map(RoleType::name).collect(Collectors.toSet()),
                        session.tokenVersion());
    }

    private record SessionIdentity(String email, Set<String> roles, Integer tokenVersion) {}

    private void writeErrorResponse(HttpServletResponse response, String message)
            throws IOException {
        ErrorResource error = ErrorResource.builder().code("UNAUTHORIZED").build();
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter()
                .write(objectMapper.writeValueAsString(ApiResource.error(error, message)));
    }
}
