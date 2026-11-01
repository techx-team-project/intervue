package com.techx.intervue.modules.ai.services.impl;

import java.util.regex.Pattern;

public final class UntrustedContent {

    private static final Pattern TAG_NAME = Pattern.compile("[a-z][a-z0-9_]*");

    private UntrustedContent() {}

    public static String wrap(String tag, String text) {
        if (!TAG_NAME.matcher(tag).matches()) {
            throw new IllegalArgumentException("Invalid untrusted content tag: " + tag);
        }
        // Escaping the tag stops the text from closing the block early to inject instructions.
        String neutralized =
                Pattern.compile("<(/?" + tag + ")", Pattern.CASE_INSENSITIVE)
                        .matcher(text)
                        .replaceAll("&lt;$1");
        return "<" + tag + ">\n" + neutralized + "\n</" + tag + ">";
    }
}
