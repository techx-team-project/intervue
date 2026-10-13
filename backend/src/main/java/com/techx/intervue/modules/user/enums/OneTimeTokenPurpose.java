package com.techx.intervue.modules.user.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OneTimeTokenPurpose {
    EMAIL_VERIFICATION("auth:verify-email:"),
    PASSWORD_RESET("auth:pwd-reset:");

    private final String keyPrefix;
}
