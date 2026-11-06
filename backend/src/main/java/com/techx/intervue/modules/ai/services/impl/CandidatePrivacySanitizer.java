package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.CandidateRawData;
import com.techx.intervue.modules.ai.services.interfaces.CandidatePrivacySanitizerInterface;
import java.util.List;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CandidatePrivacySanitizer implements CandidatePrivacySanitizerInterface {

    private static final List<Pattern> SENSITIVE_CV_PATTERNS =
            List.of(
                    Pattern.compile(
                            "(?i)(ngày\\s*sinh|date\\s*of\\s*birth|dob|năm\\s*sinh|tuổi|age)\\s*[:\\-]?\\s*[^\\r\\n]+"),
                    Pattern.compile(
                            "(?i)(giới\\s*tính|gender|sex)\\s*[:\\-]?\\s*(nam|nữ|male|female|other|khác)[^\\r\\n]*"),
                    Pattern.compile(
                            "(?i)(số\\s*cccd|số\\s*cmnd|cccd|cmnd|id\\s*card|passport|hộ\\s*chiếu)\\s*[:\\-]?\\s*[0-9a-zA-Z]+"),
                    Pattern.compile(
                            "(?i)(địa\\s*chỉ\\s*thường\\s*trú|địa\\s*chỉ\\s*nhà|quê\\s*quán|hometown|home\\s*address|permanent\\s*address)\\s*[:\\-]?\\s*[^\\r\\n]+"),
                    Pattern.compile(
                            "(?i)(câu\\s*hỏi\\s*sàng\\s*lọc|screening\\s*question|screening\\s*answer)\\s*[:\\-]?\\s*[^\\r\\n]+"));

    private static final Pattern PROHIBITED_LEAK_CHECK =
            Pattern.compile(
                    "(?i)\\b(cccd|cmnd|passport|hộ\\s*chiếu|screening\\s*question|screening\\s*answer|câu\\s*hỏi\\s*sàng\\s*lọc)\\b");

    @Override
    public String sanitizeCandidateData(CandidateRawData rawData, String rawCvText) {
        StringBuilder sb = new StringBuilder();

        if (rawData != null) {
            if (rawData.title() != null && !rawData.title().isBlank()) {
                sb.append("Current Title: ").append(rawData.title().trim()).append("\n");
            }

            if (rawData.topSkills() != null && !rawData.topSkills().isEmpty()) {
                sb.append("Skills: ").append(String.join(", ", rawData.topSkills())).append("\n\n");
            }

            if (rawData.experiences() != null && !rawData.experiences().isEmpty()) {
                sb.append("Professional Experience:\n");
                for (String exp : rawData.experiences()) {
                    if (exp != null && !exp.isBlank()) {
                        sb.append("- ").append(exp.trim()).append("\n");
                    }
                }
                sb.append("\n");
            }

            if (rawData.projects() != null && !rawData.projects().isEmpty()) {
                sb.append("Key Projects:\n");
                for (String proj : rawData.projects()) {
                    if (proj != null && !proj.isBlank()) {
                        sb.append("- ").append(proj.trim()).append("\n");
                    }
                }
                sb.append("\n");
            }

            if (rawData.educations() != null && !rawData.educations().isEmpty()) {
                sb.append("Education:\n");
                for (String edu : rawData.educations()) {
                    if (edu != null && !edu.isBlank()) {
                        sb.append("- ").append(edu.trim()).append("\n");
                    }
                }
                sb.append("\n");
            }

            if (rawData.experienceSummary() != null && !rawData.experienceSummary().isBlank()) {
                sb.append("Summary:\n").append(rawData.experienceSummary().trim()).append("\n\n");
            }
        }

        String cvContent = rawCvText;
        if (cvContent == null && rawData != null && rawData.cvText() != null) {
            cvContent = rawData.cvText();
        }

        if (cvContent != null && !cvContent.isBlank()) {
            String cleanedCv = cleanCvText(cvContent);
            sb.append("CV Document Text:\n").append(cleanedCv).append("\n");
        }

        String result = sb.toString().trim();
        validateNoSensitiveDataSent(result);
        return result;
    }

    @Override
    public void validateNoSensitiveDataSent(String sanitizedPayload) {
        if (sanitizedPayload == null) {
            return;
        }

        if (PROHIBITED_LEAK_CHECK.matcher(sanitizedPayload).find()) {
            log.error("Prohibited sensitive or screening data detected in AI payload");
            throw new AppException(ErrorCode.AI_REQUEST_REFUSED);
        }
    }

    private String cleanCvText(String raw) {
        String cleaned = raw;
        for (Pattern pattern : SENSITIVE_CV_PATTERNS) {
            cleaned = pattern.matcher(cleaned).replaceAll("[REDACTED_FOR_PRIVACY]");
        }
        return cleaned.trim();
    }
}
