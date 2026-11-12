package com.techx.intervue.common.seed;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.Normalizer;
import java.util.HexFormat;
import java.util.Locale;

public final class SeedText {

    private SeedText() {}

    public static String slug(String text) {
        String decomposed =
                Normalizer.normalize(text.replace("đ", "d").replace("Đ", "D"), Normalizer.Form.NFD);
        String ascii = decomposed.replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT);
        return ascii.replaceAll("[^a-z0-9]+", ".").replaceAll("^\\.+|\\.+$", "");
    }

    public static String compactSlug(String text) {
        return slug(text).replace(".", "");
    }

    public static String sha256(String text) {
        try {
            byte[] digest =
                    MessageDigest.getInstance("SHA-256")
                            .digest(text.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 is not available", e);
        }
    }
}
