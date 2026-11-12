package com.techx.intervue.modules.ai.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatMessage;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.JdGenerateRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.JdGenerateResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.JdGenerateQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.JdGenerateServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class JdGenerateService implements JdGenerateServiceInterface {

    public static final String FEATURE_NAME = "jd-generate";
    public static final String PROMPT_NAME = "jd-generate";
    public static final int PROMPT_VERSION = 1;
    public static final String PROMPT_VERSION_TAG = "jd-generate.v1";

    private static final int MIN_DESCRIPTION_CHARS = 50;
    private static final int MIN_REQUIREMENTS_CHARS = 20;

    private final AiGatewayServiceInterface aiGatewayService;
    private final PromptServiceInterface promptService;
    private final JdGenerateQuotaServiceInterface quotaService;
    private final CompanyServiceInterface companyService;
    private final ObjectMapper objectMapper;

    @Override
    public JdGenerateResult generate(Long recruiterUserId, String ip, JdGenerateRequest request) {
        quotaService.assertHasQuota(recruiterUserId);

        String userPrompt = buildUserPrompt(recruiterUserId, request);
        PromptTemplate systemPrompt = promptService.load(PROMPT_NAME, PROMPT_VERSION);
        AiCallContext context = new AiCallContext(FEATURE_NAME, recruiterUserId, ip, true);
        AiChatRequest chatRequest =
                new AiChatRequest(systemPrompt, List.of(AiChatMessage.user(userPrompt)), List.of());

        AiChatResult result = aiGatewayService.chat(context, chatRequest);
        if (result == null || result.text() == null || result.text().isBlank()) {
            throw new AppException(ErrorCode.AI_PROVIDER_ERROR);
        }

        ParsedJdPayload parsed = parseModelResponse(result.text(), request);
        quotaService.consume(recruiterUserId);

        return JdGenerateResult.builder()
                .description(parsed.description())
                .requirements(parsed.requirements())
                .benefits(parsed.benefits())
                .model(result.model())
                .promptVersion(PROMPT_VERSION_TAG)
                .generatedAt(Instant.now())
                .build();
    }

    private String buildUserPrompt(Long recruiterUserId, JdGenerateRequest request) {
        String language = "en".equalsIgnoreCase(request.language()) ? "en" : "vi";
        StringBuilder sb = new StringBuilder();
        sb.append("<job_input>\n");
        sb.append("Target Language: ").append(language).append("\n");
        sb.append("Job Title: ").append(request.title().trim()).append("\n");
        appendIfPresent(sb, "Seniority Level", request.level());
        appendIfPresent(sb, "Contract Type", request.contractType());
        appendIfPresent(sb, "Working Arrangement", request.workingArrangement());
        appendIfPresent(sb, "City", request.city());
        if (request.skills() != null && !request.skills().isEmpty()) {
            sb.append("Required Skills: ").append(String.join(", ", request.skills())).append("\n");
        }
        appendIfPresent(sb, "Recruiter Notes", request.notes());
        appendCompanyContext(sb, recruiterUserId);
        sb.append("</job_input>\n\n");
        sb.append("Generate the structured job description JSON for this role.");
        return sb.toString();
    }

    private void appendCompanyContext(StringBuilder sb, Long recruiterUserId) {
        try {
            CompanyResource company = companyService.findMyCompany(recruiterUserId);
            appendIfPresent(
                    sb,
                    "Company Name",
                    company.tradingName() != null ? company.tradingName() : company.name());
            appendIfPresent(sb, "Industry", company.industry());
            appendIfPresent(sb, "Company Benefits Context", company.benefits());
        } catch (AppException ignored) {
            // Optional context only; quota check already guarantees valid company access
        }
    }

    private void appendIfPresent(StringBuilder sb, String label, String value) {
        if (value != null && !value.isBlank()) {
            sb.append(label).append(": ").append(value.trim()).append("\n");
        }
    }

    private ParsedJdPayload parseModelResponse(String rawText, JdGenerateRequest request) {
        String json = extractJson(rawText);
        String description = "";
        String requirements = "";
        String benefits = "";

        try {
            JsonNode root = objectMapper.readTree(json);
            description = readTextOrBullets(root.get("description"));
            requirements = readTextOrBullets(root.get("requirements"));
            benefits = readTextOrBullets(root.get("benefits"));
        } catch (JsonProcessingException ex) {
            log.warn(
                    "Failed to parse AI JSON response for JD generation: {}. Falling back.",
                    ex.getMessage());
        }

        if (description.isBlank() && !rawText.isBlank()) {
            description = rawText.trim();
        }
        boolean english = "en".equalsIgnoreCase(request.language());
        String skillsLabel =
                request.skills() != null && !request.skills().isEmpty()
                        ? String.join(", ", request.skills())
                        : (english
                                ? "modern software engineering practices"
                                : "công nghệ liên quan");

        if (description.trim().length() < MIN_DESCRIPTION_CHARS) {
            description =
                    english
                            ? String.format(
                                    "Join our engineering team as %s.%n- Design, build, and maintain reliable software services aligned with product goals.%n- Collaborate closely with product, QA, and architecture peers across the full delivery lifecycle.%n- Participate in code reviews, testing, and continuous system improvements.",
                                    request.title().trim())
                            : String.format(
                                    "Tham gia đội ngũ kỹ thuật ở vị trí %s.%n- Thiết kế, phát triển và vận hành các tính năng, hệ thống đảm bảo hiệu năng và độ tin cậy cao.%n- Phối hợp chặt chẽ cùng Product, QA và các thành viên trong nhóm để tối ưu trải nghiệm người dùng.%n- Tham gia review code, kiểm thử và cải tiến liên tục chất lượng sản phẩm.",
                                    request.title().trim());
        }

        if (requirements.trim().length() < MIN_REQUIREMENTS_CHARS) {
            requirements =
                    english
                            ? String.format(
                                    "- Solid practical experience with %s.%n- Strong problem-solving, debugging, and teamwork skills.%n- Proactive attitude and willingness to learn new technologies.",
                                    skillsLabel)
                            : String.format(
                                    "- Có kinh nghiệm thực tế làm việc với %s.%n- Tư duy giải quyết vấn đề tốt, chủ động trong công việc và phối hợp nhóm hiệu quả.%n- Tinh thần trách nhiệm cao và sẵn sàng học hỏi công nghệ mới.",
                                    skillsLabel);
        }

        if (benefits.isBlank()) {
            benefits =
                    english
                            ? "- Competitive compensation and performance-based review.\n- Flexible, collaborative IT working environment with clear career growth."
                            : "- Mức thu nhập cạnh tranh, xét duyệt tăng lương định kỳ theo năng lực.\n- Môi trường công nghệ cởi mở, cơ hội phát triển chuyên môn và thăng tiến rõ ràng.";
        }

        return new ParsedJdPayload(description.trim(), requirements.trim(), benefits.trim());
    }

    private String readTextOrBullets(JsonNode node) {
        if (node == null || node.isNull()) {
            return "";
        }
        if (node.isArray()) {
            List<String> lines = new ArrayList<>();
            for (JsonNode item : node) {
                String line = item.asText("").trim();
                if (!line.isBlank()) {
                    lines.add(line.startsWith("-") ? line : "- " + line);
                }
            }
            return String.join("\n", lines);
        }
        return node.asText("").trim();
    }

    private String extractJson(String text) {
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return text.substring(start, end + 1);
        }
        return text.trim();
    }

    private record ParsedJdPayload(String description, String requirements, String benefits) {}
}
