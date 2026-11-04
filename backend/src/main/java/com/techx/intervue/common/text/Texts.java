package com.techx.intervue.common.text;

public final class Texts {

    private Texts() {}

    public static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
