package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.config.AuthFlowProperties;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.services.interfaces.EmailSendLimiterInterface;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSendLimiter implements EmailSendLimiterInterface {

    private final RateLimitServiceInterface rateLimitService;
    private final TokenHashUtil tokenHashUtil;
    private final AuthFlowProperties properties;

    @Override
    public void check(String route, String email, String ip) {
        enforce(route, "email:" + tokenHashUtil.hash(email));
        enforce(route, "ip:" + ip);
    }

    private void enforce(String route, String subject) {
        rateLimitService.enforce(
                route,
                subject,
                properties.resendCooldown(),
                properties.resendMaxAttempts(),
                properties.resendWindow());
    }
}
