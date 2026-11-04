package com.techx.intervue.modules.user.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OneTimeTokenPurpose {
    EMAIL_VERIFICATION("auth:verify-email:"),
    PASSWORD_RESET("auth:pwd-reset:"),
    RECRUITER_EMAIL_VERIFICATION("auth:recruiter-verify-email:"),
    RECRUITER_PASSWORD_RESET("auth:recruiter-pwd-reset:"),
    EMAIL_CHANGE("auth:email-change:"),
    RECRUITER_EMAIL_CHANGE("auth:recruiter-email-change:");

    private final String keyPrefix;
}
