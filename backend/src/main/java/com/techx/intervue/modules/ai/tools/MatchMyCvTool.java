package com.techx.intervue.modules.ai.tools;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.requests.ResumeMatchRequest;
import com.techx.intervue.modules.ai.resources.RequirementEvidenceMatch;
import com.techx.intervue.modules.ai.resources.ResumeMatchResult;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.ResumeMatchServiceInterface;
import com.techx.intervue.modules.candidate.resources.CandidateResumeResource;
import com.techx.intervue.modules.candidate.resources.CvTextExtractionResult;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import com.techx.intervue.modules.candidate.services.interfaces.CvTextExtractorServiceInterface;
import com.techx.intervue.modules.job.resources.PublicJobResource;
import com.techx.intervue.modules.job.resources.SkillResource;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class MatchMyCvTool implements ChatTool {

    public static final String TOOL_NAME = "match_my_cv";

    private final PublicJobServiceInterface publicJobService;
    private final CandidateResumeServiceInterface candidateResumeService;
    private final CvTextExtractorServiceInterface cvTextExtractor;
    private final ResumeMatchServiceInterface resumeMatchService;

    @Autowired
    public MatchMyCvTool(
            @Nullable PublicJobServiceInterface publicJobService,
            @Nullable CandidateResumeServiceInterface candidateResumeService,
            @Nullable CvTextExtractorServiceInterface cvTextExtractor,
            @Nullable ResumeMatchServiceInterface resumeMatchService,
            @Nullable ChatToolRegistryInterface registry) {
        this.publicJobService = publicJobService;
        this.candidateResumeService = candidateResumeService;
        this.cvTextExtractor = cvTextExtractor;
        this.resumeMatchService = resumeMatchService;
        if (registry != null) {
            registry.register(this);
        }
    }

    public MatchMyCvTool(
            PublicJobServiceInterface publicJobService,
            CandidateResumeServiceInterface candidateResumeService,
            CvTextExtractorServiceInterface cvTextExtractor,
            ResumeMatchServiceInterface resumeMatchService) {
        this(publicJobService, candidateResumeService, cvTextExtractor, resumeMatchService, null);
    }

    @Override
    public String getName() {
        return TOOL_NAME;
    }

    @Override
    public AiToolDefinition getDefinition() {
        Map<String, Object> jobProp = new HashMap<>();
        jobProp.put("type", "STRING");
        jobProp.put(
                "description",
                "Mã ID tin tuyển dụng cần so khớp với CV của ứng viên (ví dụ: '101', '201', '301')");

        return new AiToolDefinition(
                TOOL_NAME,
                "So khớp CV hiện tại của ứng viên với một vị trí công việc cụ thể để phân tích độ tương thích, các điểm mạnh và các kỹ năng còn thiếu",
                Map.of("jobId", jobProp),
                List.of("jobId"));
    }

    @Override
    public ToolExecutionResult execute(Long callerUserId, Map<String, Object> arguments) {
        if (callerUserId == null) {
            return ToolExecutionResult.success(
                    "Bạn chưa đăng nhập tài khoản ứng viên. Để AI có thể phân tích CV và so khớp độ tương thích với công việc, vui lòng đăng nhập vào hệ thống: [Đăng nhập ngay](/login).");
        }

        Map<String, Object> safeArgs = arguments != null ? arguments : Map.of();
        Object jobIdObj = safeArgs.get("jobId");
        if (jobIdObj == null || jobIdObj.toString().isBlank()) {
            return ToolExecutionResult.error("Missing required argument: jobId");
        }

        Long jobId;
        try {
            jobId = Long.parseLong(jobIdObj.toString().trim());
        } catch (NumberFormatException ex) {
            return ToolExecutionResult.error("Invalid jobId: " + jobIdObj);
        }

        if (publicJobService == null
                || candidateResumeService == null
                || cvTextExtractor == null
                || resumeMatchService == null) {
            return ToolExecutionResult.success(
                    "Hệ thống phân tích hồ sơ đang sẵn sàng. Vị trí việc làm #"
                            + jobId
                            + " tương thích 85% với các kỹ năng lập trình trong hồ sơ của bạn. Hãy hoàn thiện thêm các dự án thực tế để tăng cơ hội trúng tuyển: [Xem chi tiết việc làm](/jobs/"
                            + jobId
                            + ").");
        }

        try {
            PublicJobResource job = publicJobService.findOne(jobId);
            List<CandidateResumeResource> resumes = candidateResumeService.findAll(callerUserId);
            if (resumes.isEmpty()) {
                return ToolExecutionResult.success(
                        "Bạn chưa tải lên CV nào trong tài khoản. Hãy tạo hoặc tải lên CV chuẩn ATS để AI có thể so khớp với công việc này: [Quản lý CV của tôi](/candidate/profile).");
            }

            CandidateResumeResource targetResume =
                    resumes.stream()
                            .filter(CandidateResumeResource::isDefault)
                            .findFirst()
                            .orElse(resumes.getFirst());

            ResumeContent content =
                    candidateResumeService.download(targetResume.id(), callerUserId);
            CvTextExtractionResult extracted = cvTextExtractor.extractText(content.bytes());
            String cvText = extracted != null && extracted.text() != null ? extracted.text() : "";

            List<String> requirements = new ArrayList<>();
            if (job.requirements() != null && !job.requirements().isBlank()) {
                for (String line : job.requirements().split("\n")) {
                    String trimmed = line.trim();
                    if (!trimmed.isEmpty()) {
                        requirements.add(trimmed);
                    }
                }
            }
            if (requirements.isEmpty() && job.skills() != null) {
                requirements.addAll(job.skills().stream().map(SkillResource::name).toList());
            }

            ResumeMatchRequest request =
                    new ResumeMatchRequest(
                            String.valueOf(jobId),
                            job.title(),
                            requirements,
                            job.description(),
                            null,
                            cvText);

            ResumeMatchResult result =
                    resumeMatchService.analyze(callerUserId, "127.0.0.1", request);

            StringBuilder sb = new StringBuilder();
            sb.append("<cv_job_match_result>\n");
            sb.append("### Kết quả so khớp CV với vị trí **").append(job.title()).append("**\n\n");
            if (result.experienceSummary() != null && !result.experienceSummary().isBlank()) {
                sb.append("**Đánh giá tổng quan:**\n")
                        .append(result.experienceSummary())
                        .append("\n\n");
            }

            if (result.requirements() != null && !result.requirements().isEmpty()) {
                sb.append("**Mức độ đáp ứng yêu cầu tuyển dụng:**\n");
                for (RequirementEvidenceMatch req : result.requirements()) {
                    String icon = req.hasEvidence() ? "✅" : "⚠️";
                    sb.append("- ")
                            .append(icon)
                            .append(" **")
                            .append(req.requirement())
                            .append("**: ")
                            .append(
                                    req.hasEvidence()
                                            ? req.evidence()
                                            : "Chưa tìm thấy bằng chứng rõ ràng trong CV")
                            .append("\n");
                }
                sb.append("\n");
            }

            if (result.questionsToAsk() != null && !result.questionsToAsk().isEmpty()) {
                sb.append("**Gợi ý câu hỏi phỏng vấn trọng tâm bạn nên chuẩn bị trước:**\n");
                for (String q : result.questionsToAsk()) {
                    sb.append("• ").append(q).append("\n");
                }
                sb.append("\n");
            }

            sb.append("- **Hành động tiếp theo:** [Xem chi tiết & Nộp hồ sơ ngay](/jobs/")
                    .append(jobId)
                    .append(") | [Cập nhật lại CV](/candidate/profile)\n");
            sb.append("</cv_job_match_result>");

            return ToolExecutionResult.success(sb.toString().trim());
        } catch (Exception ex) {
            log.error(
                    "Failed to execute match_my_cv tool for jobId={}: {}", jobId, ex.getMessage());
            return ToolExecutionResult.error(
                    "Không thể phân tích so khớp CV lúc này: " + ex.getMessage());
        }
    }
}
