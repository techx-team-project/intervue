package com.techx.intervue.modules.candidate.services;

import static org.assertj.core.api.Assertions.assertThat;

import com.techx.intervue.modules.candidate.services.impl.CvTextCleaner;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CvTextCleanerTest {

    private CvTextCleaner cleaner;

    @BeforeEach
    void setUp() {
        cleaner = new CvTextCleaner();
    }

    @Test
    @DisplayName("Handles null and empty text gracefully")
    void handlesNullAndEmpty() {
        assertThat(cleaner.clean(null)).isEmpty();
        assertThat(cleaner.clean("")).isEmpty();
        assertThat(cleaner.clean("   \t  \n  ")).isEmpty();
    }

    @Test
    @DisplayName("Replaces PDF ligatures with standard ascii equivalents")
    void replacesLigatures() {
        String input =
                "Pro\uFB01cient in o\uFB03ce with sou\uFB04é, \uFB02ow, o\uFB05en fa\uFB06 and tra\uFB00ic";
        String cleaned = cleaner.clean(input);

        assertThat(cleaned)
                .isEqualTo("Proficient in office with soufflé, flow, often fast and traffic");
    }

    @Test
    @DisplayName("Removes zero-width characters and soft hyphens")
    void removesZeroWidthCharactersAndSoftHyphens() {
        String input = "deve\u00ADlop\u200Ber \u200Cwith \u200Dclean\u2060 \uFEFFcode";
        String cleaned = cleaner.clean(input);

        assertThat(cleaned).isEqualTo("developer with clean code");
    }

    @Test
    @DisplayName("Normalizes Unicode accents to canonical NFC")
    void normalizesUnicodeNfc() {
        // Decomposed NFD 'ễ' = 'e' + combining circumflex (\u0302) + combining tilde (\u0303)
        String nfd = "Nguy\u0065\u0302\u0303n V\u0103n A";
        String cleaned = cleaner.clean(nfd);

        assertThat(cleaned).isEqualTo("Nguyễn Văn A");
    }

    @Test
    @DisplayName("Normalizes exotic bullet glyphs into standard dash bullets")
    void normalizesBullets() {
        String input = "• First item\n◦ Second item\n▪ Third item\n✓ Fourth item";
        String cleaned = cleaner.clean(input);

        assertThat(cleaned).isEqualTo("- First item\n- Second item\n- Third item\n- Fourth item");
    }

    @Test
    @DisplayName("Normalizes line breaks and collapses excessive empty lines")
    void normalizesWhitespaceAndExcessiveLines() {
        String input = "Line 1   with   spaces\r\n\r\n\r\n\r\nLine 2\rLine 3\n\n\nLine 4";
        String cleaned = cleaner.clean(input);

        assertThat(cleaned).isEqualTo("Line 1 with spaces\n\nLine 2\nLine 3\n\nLine 4");
    }

    @Test
    @DisplayName("Correctly identifies likely scanned or empty documents")
    void identifiesScannedOrEmptyText() {
        assertThat(cleaner.isLikelyScanned(null)).isTrue();
        assertThat(cleaner.isLikelyScanned("")).isTrue();
        assertThat(cleaner.isLikelyScanned("Page 1 of 1")).isTrue();
        assertThat(cleaner.isLikelyScanned("A short string < 50 chars")).isTrue();

        String realCvSnippet =
                "Nguyen Van A - Senior Java Software Engineer\n"
                        + "Email: nguyen.vana@example.com | Phone: 0912345678\n"
                        + "Summary: Over 5 years of experience in Spring Boot, MySQL, and Redis.";
        assertThat(cleaner.isLikelyScanned(realCvSnippet)).isFalse();
    }
}
