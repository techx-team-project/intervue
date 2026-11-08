package com.techx.intervue.modules.user.enums;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import java.util.Arrays;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum OAuthProvider {
    GOOGLE("google", "Google");

    private final String pathSegment;
    private final String displayName;

    public static OAuthProvider fromPathSegment(String segment) {
        return Arrays.stream(values())
                .filter(provider -> provider.pathSegment.equalsIgnoreCase(segment))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
