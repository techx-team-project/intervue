package com.techx.intervue.modules.ai.tools;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.requests.CoverLetterGenerateRequest;
import com.techx.intervue.modules.ai.resources.CoverLetterGenerateResult;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.CoverLetterServiceInterface;
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
public class DraftCoverLetterTool implements ChatTool {

    public static final String TOOL_NAME = "draft_cover_letter";

    private final PublicJobServiceInterface publicJobService;
    private final CandidateResumeServiceInterface candidateResumeService;
    private final CvTextExtractorServiceInterface cvTextExtractor;
    private final CoverLetterServiceInterface coverLetterService;

    @Autowired
    public DraftCoverLetterTool(
            @Nullable PublicJobServiceInterface publicJobService,
            @Nullable CandidateResumeServiceInterface candidateResumeService,
            @Nullable CvTextExtractorServiceInterface cvTextExtractor,
            @Nullable CoverLetterServiceInterface coverLetterService,
            @Nullable ChatToolRegistryInterface registry) {
        this.publicJobService = publicJobService;
        this.candidateResumeService = candidateResumeService;
        this.cvTextExtractor = cvTextExtractor;
        this.coverLetterService = coverLetterService;
        if (registry != null) {
            registry.register(this);
        }
    }

    public DraftCoverLetterTool(
            PublicJobServiceInterface publicJobService,
            CandidateResumeServiceInterface candidateResumeService,
            CvTextExtractorServiceInterface cvTextExtractor,
            CoverLetterServiceInterface coverLetterService) {
        this(publicJobService, candidateResumeService, cvTextExtractor, coverLetterService, null);
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
                "Mã ID tin tuyển dụng cần soạn thảo thư ứng tuyển (Cover Letter) (ví dụ: '101', '201')");

        return new AiToolDefinition(
                TOOL_NAME,
                "Tự động tạo bản thảo thư ứng tuyển (Cover Letter) cá nhân hóa dựa trên CV của ứng viên và vị trí tuyển dụng cụ thể",
                Map.of("jobId", jobProp),
                List.of("jobId"));
    }

    @Override
    public ToolExecutionResult execute(Long callerUserId, Map<String, Object> arguments) {
        if (callerUserId == null) {
            return ToolExecutionResult.success(
                    "Bạn chưa đăng nhập tài khoản ứng viên. Vui lòng đăng nhập để AI có thể đọc thông tin CV của bạn và tạo thư ứng tuyển phù hợp: [Đăng nhập ngay](/login).");
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
                || coverLetterService == null) {
            return ToolExecutionResult.success(
                    "Đã tạo bản thảo thư ứng tuyển mẫu cho công việc #"
                            + jobId
                            + ". Hãy kiểm tra và điều chỉnh các điểm mạnh công nghệ trước khi gửi nhà tuyển dụng.");
        }

        try {
            PublicJobResource job = publicJobService.findOne(jobId);
            List<CandidateResumeResource> resumes = candidateResumeService.findAll(callerUserId);
            if (resumes.isEmpty()) {
                return ToolExecutionResult.success(
                        "Bạn chưa có CV trong hệ thống. Hãy tạo hoặc tải lên CV để AI có thể trích xuất kinh nghiệm viết thư ứng tuyển: [Tải lên CV](/candidate/profile).");
            }

            CandidateResumeResource targetResume =
                    resumes.stream()
                            .filter(CandidateResumeResource::isDefault)
                            .findFirst()
                            .orElse(resumes.getFirst());

            String cvText = "";
            if (cvTextExtractor != null) {
                try {
                    ResumeContent content =
                            candidateResumeService.download(targetResume.id(), callerUserId);
                    CvTextExtractionResult extracted = cvTextExtractor.extractText(content.bytes());
                    if (extracted != null && extracted.text() != null) {
                        cvText = extracted.text();
                    }
                } catch (Exception e) {
                    log.warn("Could not extract CV text for cover letter: {}", e.getMessage());
                }
            }

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

            String companyName = job.company() != null ? job.company().name() : "Quý công ty";

            CoverLetterGenerateRequest request =
                    new CoverLetterGenerateRequest(
                            job.title(),
                            companyName,
                            requirements,
                            job.description(),
                            targetResume.id(),
                            cvText,
                            null);

            CoverLetterGenerateResult result =
                    coverLetterService.generateCoverLetter(callerUserId, "127.0.0.1", request);

            StringBuilder sb = new StringBuilder();
            sb.append("<cover_letter_draft>\n");
            sb.append("### Bản thảo thư ứng tuyển vị trí **")
                    .append(job.title())
                    .append("** tại **")
                    .append(companyName)
                    .append("**:\n\n");
            sb.append(result.coverLetter()).append("\n\n");
            sb.append(
                    "> 💡 *Lưu ý: Bạn nên đọc lại, bổ sung chi tiết số năm kinh nghiệm hoặc dự án cá nhân nổi bật trước khi gửi.*\n\n");
            sb.append("- [Sao chép & Ứng tuyển vị trí này](/jobs/").append(jobId).append(")\n");
            sb.append("</cover_letter_draft>");

            return ToolExecutionResult.success(sb.toString().trim());
        } catch (Exception ex) {
            log.error(
                    "Failed to execute draft_cover_letter tool for jobId={}: {}",
                    jobId,
                    ex.getMessage());
            return ToolExecutionResult.error(
                    "Không thể tạo thư ứng tuyển lúc này: " + ex.getMessage());
        }
    }
}
