package com.techx.intervue.modules.ai.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.ai.requests.CandidateRawData;
import com.techx.intervue.modules.ai.services.impl.CandidatePrivacySanitizer;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CandidatePrivacySanitizerTest {

    private CandidatePrivacySanitizer sanitizer;

    @BeforeEach
    void setUp() {
        sanitizer = new CandidatePrivacySanitizer();
    }

    @Test
    @DisplayName(
            "Should strip age, gender, photo, origin, KYC, and screening questions from candidate data")
    void shouldStripAllSensitiveAndScreeningData() {
        CandidateRawData rawData =
                new CandidateRawData(
                        "Nguyễn Văn A",
                        "Senior Java Developer",
                        List.of("Java", "Spring Boot", "MySQL"),
                        "5 years experience building distributed backends.",
                        List.of("TechX: Designed high throughput REST APIs with Spring Boot."),
                        List.of("E-commerce: Kafka event streaming"),
                        List.of("B.S. Computer Science"),
                        "CV Text: Experienced developer with Java and Spring Boot.",
                        // Sensitive fields:
                        28,
                        1998,
                        "1998-05-15",
                        "MALE",
                        "https://example.com/avatar.jpg",
                        "https://example.com/photo.png",
                        "Số 123 Cầu Giấy, Hà Nội",
                        "Hải Dương",
                        "Hải Dương",
                        "030098001234",
                        "030098001234",
                        "B1234567",
                        List.of("Mức lương mong muốn của bạn?", "Bạn có thể đi làm ngay không?"),
                        List.of("35 triệu", "Có"));

        String sanitized = sanitizer.sanitizeCandidateData(rawData, null);

        // Positive assertions: Technical info preserved
        assertThat(sanitized).contains("Senior Java Developer");
        assertThat(sanitized).contains("Java, Spring Boot, MySQL");
        assertThat(sanitized)
                .contains("TechX: Designed high throughput REST APIs with Spring Boot.");

        // Negative assertions: Prohibited fields MUST NOT be present
        assertThat(sanitized).doesNotContain("1998-05-15");
        assertThat(sanitized).doesNotContain("MALE");
        assertThat(sanitized).doesNotContain("avatar.jpg");
        assertThat(sanitized).doesNotContain("photo.png");
        assertThat(sanitized).doesNotContain("030098001234");
        assertThat(sanitized).doesNotContain("B1234567");
        assertThat(sanitized).doesNotContain("Mức lương mong muốn của bạn?");
        assertThat(sanitized).doesNotContain("Bạn có thể đi làm ngay không?");
        assertThat(sanitized).doesNotContain("Số 123 Cầu Giấy");
        assertThat(sanitized).doesNotContain("Hải Dương");
    }

    @Test
    @DisplayName("Should redact sensitive labels from raw CV text")
    void shouldRedactSensitiveLabelsFromCvText() {
        String cvWithPii =
                """
                Nguyễn Văn A - Java Engineer
                Ngày sinh: 15/05/1998
                Giới tính: Nam
                Số CCCD: 030098001234
                Địa chỉ thường trú: 123 Duy Tân, Hà Nội
                Kỹ năng: Java, Spring Boot, Microservices
                """;

        String sanitized = sanitizer.sanitizeCandidateData(null, cvWithPii);

        assertThat(sanitized).contains("Java Engineer");
        assertThat(sanitized).contains("Java, Spring Boot, Microservices");
        assertThat(sanitized).doesNotContain("15/05/1998");
        assertThat(sanitized).doesNotContain("Nam");
        assertThat(sanitized).doesNotContain("030098001234");
        assertThat(sanitized).contains("[REDACTED_FOR_PRIVACY]");
    }

    @Test
    @DisplayName("Should throw AppException if prohibited sensitive terms leak into payload")
    void shouldThrowExceptionIfProhibitedDataLeaks() {
        String leakedPayload = "Candidate background: CCCD 0123456789 with Spring Boot";
        assertThatThrownBy(() -> sanitizer.validateNoSensitiveDataSent(leakedPayload))
                .isInstanceOf(AppException.class);
    }
}
