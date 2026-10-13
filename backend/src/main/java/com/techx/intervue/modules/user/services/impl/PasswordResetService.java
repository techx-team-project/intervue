package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;
import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.enums.OneTimeTokenPurpose;
import com.techx.intervue.modules.user.events.PasswordResetRequestedEvent;
import com.techx.intervue.modules.user.repositories.RefreshTokenRepository;
import com.techx.intervue.modules.user.repositories.UserRepository;
import com.techx.intervue.modules.user.requests.ForgotPasswordRequest;
import com.techx.intervue.modules.user.requests.ResetPasswordRequest;
import com.techx.intervue.modules.user.services.interfaces.EmailSendLimiterInterface;
import com.techx.intervue.modules.user.services.interfaces.OneTimeTokenServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.PasswordResetServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PasswordResetService implements PasswordResetServiceInterface {

    private static final String FORGOT_ROUTE = "forgot-password";

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final OneTimeTokenServiceInterface oneTimeTokenService;
    private final EmailSendLimiterInterface emailSendLimiter;
    private final PasswordEncoder passwordEncoder;
    private final UserSessionCache userSessionCache;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public void forgot(ForgotPasswordRequest request, String ip) {
        String email = EmailHelper.normalize(request.email());
        emailSendLimiter.check(FORGOT_ROUTE, email, ip);
        userRepository
                .findByEmail(email)
                .ifPresent(
                        user ->
                                eventPublisher.publishEvent(
                                        new PasswordResetRequestedEvent(
                                                user.getId(), user.getEmail(), user.getName())));
    }

    @Override
    @Transactional
    public void reset(ResetPasswordRequest request) {
        Long userId =
                oneTimeTokenService
                        .peek(OneTimeTokenPurpose.PASSWORD_RESET, request.token())
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));
        PasswordPolicy.verify(request.password(), request.confirmPassword(), user.getEmail());

        oneTimeTokenService
                .consume(OneTimeTokenPurpose.PASSWORD_RESET, request.token())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_OR_EXPIRED_TOKEN));

        user.setPassword(passwordEncoder.encode(request.password()));
        refreshTokenRepository.revokeAllRefreshTokenByUser(user.getId());
        userSessionCache.evict(user.getId());
    }
}
