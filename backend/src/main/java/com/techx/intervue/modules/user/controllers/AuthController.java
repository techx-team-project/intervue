package com.techx.intervue.modules.user.controllers;

import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.filters.JwtAuthFilter;
import com.techx.intervue.modules.helpers.CookieHelper;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.enums.OAuthProvider;
import com.techx.intervue.modules.user.requests.ForgotPasswordRequest;
import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.requests.OAuthAuthorizeRequest;
import com.techx.intervue.modules.user.requests.OAuthCallbackRequest;
import com.techx.intervue.modules.user.requests.RegisterRequest;
import com.techx.intervue.modules.user.requests.ResetPasswordRequest;
import com.techx.intervue.modules.user.requests.VerifyEmailRequest;
import com.techx.intervue.modules.user.resources.AuthResource;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.resources.OAuthAuthorizeResource;
import com.techx.intervue.modules.user.resources.OAuthAuthorizeResult;
import com.techx.intervue.modules.user.services.interfaces.AuthServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.EmailChangeServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.EmailVerificationServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.PasswordResetServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.SocialAuthServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserRegistrationServiceInterface;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController extends BaseController {

    private static final String FORGOT_PASSWORD_MESSAGE =
            "If the email exists, you will receive a password reset link within 5 minutes.";

    private final UserRegistrationServiceInterface userRegistrationService;
    private final AuthServiceInterface authService;
    private final EmailVerificationServiceInterface emailVerificationService;
    private final PasswordResetServiceInterface passwordResetService;
    private final EmailChangeServiceInterface emailChangeService;
    private final SocialAuthServiceInterface socialAuthService;
    private final AuthConfig authConfig;

    @PostMapping("/register")
    public ResponseEntity<ApiResource<AuthResource>> register(
            @Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ip = IpHelper.getClientIp(httpRequest);
        return withSession(
                userRegistrationService.register(request, userAgent, ip),
                "Account registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResource<AuthResource>> login(
            @Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ip = IpHelper.getClientIp(httpRequest);
        AuthResult result = authService.login(request, userAgent, ip);
        return withSession(result, "Logged in successfully!");
    }

    @PostMapping("/oauth/{provider}/authorize")
    public ResponseEntity<ApiResource<OAuthAuthorizeResource>> authorizeOAuth(
            @PathVariable String provider,
            @Valid @RequestBody OAuthAuthorizeRequest request,
            HttpServletRequest httpRequest) {
        OAuthProvider oauthProvider = OAuthProvider.fromPathSegment(provider);
        OAuthAuthorizeResult result =
                socialAuthService.authorize(
                        oauthProvider, request, IpHelper.getClientIp(httpRequest));
        return ResponseEntity.ok()
                .header(
                        HttpHeaders.SET_COOKIE,
                        CookieHelper.buildOAuthStateNonceCookie(result.nonce()).toString())
                .body(
                        ApiResource.success(
                                new OAuthAuthorizeResource(result.authorizationUrl()),
                                "Redirecting to " + oauthProvider.getDisplayName() + "..."));
    }

    @PostMapping("/oauth/{provider}")
    public ResponseEntity<ApiResource<AuthResource>> loginWithOAuth(
            @PathVariable String provider,
            @Valid @RequestBody OAuthCallbackRequest request,
            @CookieValue(name = CookieHelper.OAUTH_STATE_NONCE_COOKIE, required = false)
                    String nonce,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        httpResponse.addHeader(
                HttpHeaders.SET_COOKIE, CookieHelper.clearOAuthStateNonceCookie().toString());
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ip = IpHelper.getClientIp(httpRequest);
        AuthResult result =
                socialAuthService.callback(
                        OAuthProvider.fromPathSegment(provider), request, nonce, userAgent, ip);
        ResponseEntity<ApiResource<AuthResource>> response =
                withSession(result, "Logged in successfully!");
        return ResponseEntity.status(response.getStatusCode())
                .headers(
                        headers -> {
                            headers.addAll(response.getHeaders());
                            headers.add(
                                    HttpHeaders.SET_COOKIE,
                                    CookieHelper.clearOAuthStateNonceCookie().toString());
                        })
                .body(response.getBody());
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<ApiResource<AuthResource>> verifyTwoFactor(
            @Valid @RequestBody
                    com.techx.intervue.modules.user.requests.TwoFactorChallengeRequest request,
            HttpServletRequest httpRequest) {
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ip = IpHelper.getClientIp(httpRequest);
        AuthResult result = authService.verifyTwoFactor(request, userAgent, ip);
        return withSession(result, "Two-factor authentication verified successfully!");
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResource<AuthResource>> refresh(
            @CookieValue(name = CookieHelper.REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken,
            HttpServletRequest httpRequest) {
        if (refreshToken == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ip = IpHelper.getClientIp(httpRequest);
        return withSession(
                authService.refresh(refreshToken, userAgent, ip),
                "Session refreshed successfully!");
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated() and !hasRole('RECRUITER')")
    public ResponseEntity<ApiResource<Void>> logout(
            @RequestAttribute(JwtAuthFilter.TOKEN_ATTRIBUTE) String accessToken,
            @CookieValue(name = CookieHelper.REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        authService.logout(accessToken, refreshToken);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, CookieHelper.clearRefreshTokenCookie().toString())
                .body(ApiResource.success(null, "Logged out successfully!"));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResource<Void>> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request) {
        emailVerificationService.verify(request.token());
        return ok(null, "Email verified successfully!");
    }

    @PostMapping("/confirm-email-change")
    public ResponseEntity<ApiResource<Void>> confirmEmailChange(
            @Valid @RequestBody VerifyEmailRequest request) {
        emailChangeService.confirm(request.token());
        return ok(null, "Email changed successfully, please log in again!");
    }

    @PostMapping("/resend-verification")
    @PreAuthorize("isAuthenticated() and !hasRole('RECRUITER')")
    public ResponseEntity<ApiResource<Void>> resendVerification(
            @AuthenticationPrincipal CustomUserDetails principal, HttpServletRequest httpRequest) {
        emailVerificationService.resend(principal.getId(), IpHelper.getClientIp(httpRequest));
        return ok(null, "Verification email sent again!");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResource<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        passwordResetService.forgot(request, IpHelper.getClientIp(httpRequest));
        return ok(null, FORGOT_PASSWORD_MESSAGE);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResource<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.reset(request);
        return ok(null, "Password reset successfully, please log in again!");
    }

    private ResponseEntity<ApiResource<AuthResource>> withSession(
            AuthResult result, String message) {
        if (Boolean.TRUE.equals(result.requiresTwoFactor())) {
            return ResponseEntity.ok(
                    ApiResource.success(
                            AuthResource.challenge(result.tempToken()),
                            "Two-factor authentication required."));
        }
        ResponseCookie refreshCookie =
                CookieHelper.buildRefreshTokenCookie(
                        result.refreshToken(),
                        Duration.ofDays(authConfig.getRefreshTokenTTLDays()));
        AuthResource body = new AuthResource(result.accessToken(), result.user());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(ApiResource.success(body, message));
    }
}
