package com.techx.intervue.modules.user.controllers;

import com.techx.intervue.config.AuthConfig;
import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.filters.JwtAuthFilter;
import com.techx.intervue.modules.helpers.CookieHelper;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.requests.ForgotPasswordRequest;
import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.requests.RegisterRequest;
import com.techx.intervue.modules.user.requests.ResetPasswordRequest;
import com.techx.intervue.modules.user.requests.VerifyEmailRequest;
import com.techx.intervue.modules.user.resources.AuthResource;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.services.interfaces.AuthServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.EmailVerificationServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.PasswordResetServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
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

    private final UserServiceInterface userService;
    private final AuthServiceInterface authService;
    private final EmailVerificationServiceInterface emailVerificationService;
    private final PasswordResetServiceInterface passwordResetService;
    private final AuthConfig authConfig;

    @PostMapping("/register")
    public ResponseEntity<ApiResource<AuthResource>> register(
            @Valid @RequestBody RegisterRequest request) {
        return withSession(userService.register(request), "Account registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResource<AuthResource>> login(
            @Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        AuthResult result = authService.login(request, IpHelper.getClientIp(httpRequest));
        return withSession(result, "Logged in successfully!");
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResource<AuthResource>> refresh(
            @CookieValue(name = CookieHelper.REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        if (refreshToken == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return withSession(authService.refresh(refreshToken), "Session refreshed successfully!");
    }

    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
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

    @PostMapping("/resend-verification")
    @PreAuthorize("isAuthenticated()")
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
