package com.techx.intervue.modules.candidate.services.impl;

import java.text.Normalizer;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class CvTextCleaner {

    private static final Pattern LIGATURE_FF = Pattern.compile("\uFB00");
    private static final Pattern LIGATURE_FI = Pattern.compile("\uFB01");
    private static final Pattern LIGATURE_FL = Pattern.compile("\uFB02");
    private static final Pattern LIGATURE_FFI = Pattern.compile("\uFB03");
    private static final Pattern LIGATURE_FFL = Pattern.compile("\uFB04");
    private static final Pattern LIGATURE_FT = Pattern.compile("\uFB05");
    private static final Pattern LIGATURE_ST = Pattern.compile("\uFB06");

    private static final Pattern ZERO_WIDTH_AND_SOFT_HYPHEN =
            Pattern.compile("[\u00AD\u200B\u200C\u200D\u2060\uFEFF]");

    private static final Pattern CONTROL_CHARS =
            Pattern.compile("[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]");

    private static final Pattern LINE_BREAKS = Pattern.compile("\r\n|\r");

    private static final Pattern BULLETS =
            Pattern.compile(
                    "(?m)^[ \\t]*[\u2022\u25E6\u2043\u2219\u25AA\u25CF\u27A2\u2713\u2714\u2605][ \\t]*");

    private static final Pattern HORIZONTAL_WHITESPACE = Pattern.compile("[^\\S\\r\\n]+");

    private static final Pattern TRAILING_SPACES_PER_LINE = Pattern.compile("[ \\t]+(?=\n)");

    private static final Pattern EXCESSIVE_NEWLINES = Pattern.compile("\n{3,}");

    private static final int MIN_TEXT_LENGTH = 50;
    private static final int MIN_ALPHANUMERIC_COUNT = 30;

    public String clean(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return "";
        }

        String text = Normalizer.normalize(rawText, Normalizer.Form.NFC);

        text = LIGATURE_FFI.matcher(text).replaceAll("ffi");
        text = LIGATURE_FFL.matcher(text).replaceAll("ffl");
        text = LIGATURE_FF.matcher(text).replaceAll("ff");
        text = LIGATURE_FI.matcher(text).replaceAll("fi");
        text = LIGATURE_FL.matcher(text).replaceAll("fl");
        text = LIGATURE_FT.matcher(text).replaceAll("ft");
        text = LIGATURE_ST.matcher(text).replaceAll("st");

        text = ZERO_WIDTH_AND_SOFT_HYPHEN.matcher(text).replaceAll("");
        text = CONTROL_CHARS.matcher(text).replaceAll(" ");
        text = LINE_BREAKS.matcher(text).replaceAll("\n");
        text = BULLETS.matcher(text).replaceAll("- ");
        text = HORIZONTAL_WHITESPACE.matcher(text).replaceAll(" ");
        text = TRAILING_SPACES_PER_LINE.matcher(text).replaceAll("");
        text = EXCESSIVE_NEWLINES.matcher(text).replaceAll("\n\n");

        return text.trim();
    }

    public boolean isLikelyScanned(String text) {
        if (text == null || text.isBlank()) {
            return true;
        }
        if (text.length() < MIN_TEXT_LENGTH) {
            return true;
        }
        long alphanumericCount = text.codePoints().filter(Character::isLetterOrDigit).count();
        return alphanumericCount < MIN_ALPHANUMERIC_COUNT;
    }
}
