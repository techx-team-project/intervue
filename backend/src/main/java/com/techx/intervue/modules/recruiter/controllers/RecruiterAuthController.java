package com.techx.intervue.modules.recruiter.controllers;

import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.filters.JwtAuthFilter;
import com.techx.intervue.modules.helpers.CookieHelper;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.recruiter.requests.RecruiterRegisterRequest;
import com.techx.intervue.modules.recruiter.resources.RecruiterAuthResource;
import com.techx.intervue.modules.recruiter.resources.RecruiterAuthResult;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterAuthServiceInterface;
import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/auth")
@RequiredArgsConstructor
public class RecruiterAuthController extends BaseController {

    private final RecruiterAuthServiceInterface recruiterAuthService;
    private final AuthConfig authConfig;

    @PostMapping("/register")
    public ResponseEntity<ApiResource<RecruiterAuthResource>> register(
            @Valid @RequestBody RecruiterRegisterRequest request, HttpServletRequest httpRequest) {
        return withSession(
                recruiterAuthService.register(
                        request,
                        httpRequest.getHeader(HttpHeaders.USER_AGENT),
                        IpHelper.getClientIp(httpRequest)),
                "Recruiter account registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResource<RecruiterAuthResource>> login(
            @Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return withSession(
                recruiterAuthService.login(
                        request,
                        httpRequest.getHeader(HttpHeaders.USER_AGENT),
                        IpHelper.getClientIp(httpRequest)),
                "Logged in successfully!");
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResource<RecruiterAuthResource>> refresh(
            @CookieValue(name = CookieHelper.RECRUITER_REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken,
            HttpServletRequest httpRequest) {
        if (refreshToken == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return withSession(
                recruiterAuthService.refresh(
                        refreshToken,
                        httpRequest.getHeader(HttpHeaders.USER_AGENT),
                        IpHelper.getClientIp(httpRequest)),
                "Session refreshed successfully!");
    }

    @PostMapping("/logout")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResource<Void>> logout(
            @RequestAttribute(JwtAuthFilter.TOKEN_ATTRIBUTE) String accessToken,
            @CookieValue(name = CookieHelper.RECRUITER_REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        recruiterAuthService.logout(accessToken, refreshToken);
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        CookieHelper.clearRecruiterRefreshTokenCookie().toString())
                .body(ApiResource.success(null, "Logged out successfully!"));
    }

    private ResponseEntity<ApiResource<RecruiterAuthResource>> withSession(
            RecruiterAuthResult result, String message) {
        String cookie =
                CookieHelper.buildRecruiterRefreshTokenCookie(
                                result.refreshToken(),
                                Duration.ofDays(authConfig.getRefreshTokenTTLDays()))
                        .toString();
        RecruiterAuthResource body =
                new RecruiterAuthResource(result.accessToken(), result.recruiter());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie)
                .body(ApiResource.success(body, message));
    }
}
