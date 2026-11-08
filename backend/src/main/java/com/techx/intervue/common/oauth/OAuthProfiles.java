package com.techx.intervue.common.oauth;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.EmailHelper;

public final class OAuthProfiles {

    private static final int MAX_NAME_LENGTH = 50;
    private static final int MAX_EMAIL_LENGTH = 100;
    private static final String GMAIL_SUFFIX = "@gmail.com";

    private OAuthProfiles() {}

    public static String authoritativeEmail(OAuthProfile profile) {
        if (profile.email() == null || profile.email().isBlank() || !profile.emailVerified()) {
            throw new AppException(ErrorCode.OAUTH_EMAIL_UNVERIFIED);
        }
        String email = EmailHelper.normalize(profile.email());
        boolean authoritative =
                email.endsWith(GMAIL_SUFFIX)
                        || (profile.hostedDomain() != null && !profile.hostedDomain().isBlank());
        if (!authoritative || email.length() > MAX_EMAIL_LENGTH) {
            throw new AppException(ErrorCode.OAUTH_EMAIL_UNVERIFIED);
        }
        return email;
    }

    public static String displayName(String providerName, String email) {
        String name =
                providerName != null && !providerName.isBlank()
                        ? providerName.trim()
                        : email.substring(0, email.indexOf('@'));
        return name.codePointCount(0, name.length()) > MAX_NAME_LENGTH
                ? name.substring(0, name.offsetByCodePoints(0, MAX_NAME_LENGTH))
                : name;
    }
}
