package com.techx.intervue.common.text;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

public final class ContentTermMatcher {

    private static final Pattern MARKS = Pattern.compile("\\p{M}+");
    private static final Pattern WHITESPACE = Pattern.compile("\\s+");
    private static final int LOOSE_MIN_LENGTH = 6;

    private ContentTermMatcher() {}

    public static String fold(String text) {
        if (text == null) {
            return "";
        }
        String lowered = Normalizer.normalize(text, Normalizer.Form.NFC).toLowerCase(Locale.ROOT);
        return WHITESPACE.matcher(lowered).replaceAll(" ").trim();
    }

    public static String strip(String text) {
        String decomposed = Normalizer.normalize(fold(text).replace('đ', 'd'), Normalizer.Form.NFD);
        return MARKS.matcher(decomposed).replaceAll("");
    }

    // Short accented words (e.g. "đĩ") collapse onto common words once accents are removed.
    public static boolean matches(String text, String term, boolean regex) {
        String strippedText = strip(text);
        if (regex) {
            return matchesRegex(strippedText, term);
        }
        if (containsWord(fold(text), fold(term))) {
            return true;
        }
        String strippedTerm = strip(term);
        return isSafeToStrip(strippedTerm) && containsWord(strippedText, strippedTerm);
    }

    private static boolean matchesRegex(String strippedText, String pattern) {
        try {
            return Pattern.compile(pattern, Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE)
                    .matcher(strippedText)
                    .find();
        } catch (PatternSyntaxException exception) {
            return false;
        }
    }

    private static boolean isSafeToStrip(String strippedTerm) {
        return strippedTerm.contains(" ") || strippedTerm.length() >= LOOSE_MIN_LENGTH;
    }

    private static boolean containsWord(String text, String term) {
        if (term.isEmpty()) {
            return false;
        }
        Pattern wordPattern =
                Pattern.compile(
                        "(?<![\\p{L}\\p{N}\\p{M}])"
                                + Pattern.quote(term)
                                + "(?![\\p{L}\\p{N}\\p{M}])");
        return wordPattern.matcher(text).find();
    }
}
