package com.techx.intervue.modules.helpers;

import java.util.Locale;

public final class EmailHelper {
    private EmailHelper() {}

    public static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
