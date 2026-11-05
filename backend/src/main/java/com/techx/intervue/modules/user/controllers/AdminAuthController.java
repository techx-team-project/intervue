package com.techx.intervue.modules.user.controllers;

import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.filters.JwtAuthFilter;
import com.techx.intervue.modules.helpers.CookieHelper;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.requests.TwoFactorChallengeRequest;
import com.techx.intervue.modules.user.resources.AdminAuthResource;
import com.techx.intervue.modules.user.resources.AdminAuthResult;
import com.techx.intervue.modules.user.resources.AdminProfileResource;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.services.interfaces.AdminAuthServiceInterface;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController extends BaseController {

    private final AdminAuthServiceInterface adminAuthService;
    private final AuthConfig authConfig;

    @PostMapping("/login")
    public ResponseEntity<ApiResource<AdminAuthResource>> login(
            @Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ip = IpHelper.getClientIp(httpRequest);
        AdminAuthResult result = adminAuthService.login(request, userAgent, ip);
        return withSession(result, "Administrator authenticated successfully!");
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<ApiResource<AdminAuthResource>> verifyTwoFactor(
            @Valid @RequestBody TwoFactorChallengeRequest request, HttpServletRequest httpRequest) {
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ip = IpHelper.getClientIp(httpRequest);
        AdminAuthResult result = adminAuthService.verifyTwoFactor(request, userAgent, ip);
        return withSession(result, "Admin two-factor verification successful!");
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResource<AdminAuthResource>> refresh(
            @CookieValue(name = CookieHelper.ADMIN_REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken,
            HttpServletRequest httpRequest) {
        List<String> tokens = new ArrayList<>();
        if (refreshToken != null) {
            tokens.add(refreshToken);
        }
        if (httpRequest.getCookies() != null) {
            for (Cookie c : httpRequest.getCookies()) {
                if (CookieHelper.ADMIN_REFRESH_TOKEN_COOKIE.equals(c.getName())
                        && !tokens.contains(c.getValue())) {
                    tokens.add(c.getValue());
                }
            }
        }
        if (tokens.isEmpty()) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ip = IpHelper.getClientIp(httpRequest);
        AdminAuthResult result = null;
        AppException lastException = null;
        for (String token : tokens) {
            try {
                result = adminAuthService.refresh(token, userAgent, ip);
                break;
            } catch (AppException ex) {
                lastException = ex;
            }
        }
        if (result == null) {
            throw lastException != null
                    ? lastException
                    : new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return withSession(result, "Admin session refreshed successfully!");
    }

    @PostMapping("/logout")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResource<Void>> logout(
            @RequestAttribute(JwtAuthFilter.TOKEN_ATTRIBUTE) String accessToken,
            @CookieValue(name = CookieHelper.ADMIN_REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        adminAuthService.logout(accessToken, refreshToken);
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        CookieHelper.clearAdminRefreshTokenCookie().toString())
                .header(
                        HttpHeaders.SET_COOKIE,
                        CookieHelper.clearLegacyAdminRefreshTokenCookie().toString())
                .body(ApiResource.success(null, "Admin logged out successfully!"));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResource<AdminProfileResource>> getMe(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ok(adminAuthService.getMe(user.getId()), "Admin profile retrieved successfully!");
    }

    private ResponseEntity<ApiResource<AdminAuthResource>> withSession(
            AdminAuthResult result, String message) {
        if (Boolean.TRUE.equals(result.requiresTwoFactor())) {
            return ResponseEntity.ok(
                    ApiResource.success(
                            AdminAuthResource.challenge(result.tempToken()),
                            "Two-factor authentication required."));
        }

        ResponseCookie refreshCookie =
                CookieHelper.buildAdminRefreshTokenCookie(
                        result.refreshToken(),
                        Duration.ofDays(authConfig.getRefreshTokenTTLDays()));
        ResponseCookie legacyClearCookie = CookieHelper.clearLegacyAdminRefreshTokenCookie();
        AdminAuthResource body = new AdminAuthResource(result.accessToken(), result.admin());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .header(HttpHeaders.SET_COOKIE, legacyClearCookie.toString())
                .body(ApiResource.success(body, message));
    }
}
