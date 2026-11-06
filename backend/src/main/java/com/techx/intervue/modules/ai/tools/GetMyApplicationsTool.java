package com.techx.intervue.modules.ai.tools;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.CandidateApplicationResult;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.CandidateApplicationServiceInterface;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class GetMyApplicationsTool implements ChatTool {

    public static final String TOOL_NAME = "get_my_applications";
    private static final int CAPPED_RESULTS = 3;

    private final CandidateApplicationServiceInterface candidateApplicationService;

    public GetMyApplicationsTool(CandidateApplicationServiceInterface candidateApplicationService) {
        this(candidateApplicationService, null);
    }

    @Autowired
    public GetMyApplicationsTool(
            CandidateApplicationServiceInterface candidateApplicationService,
            @Nullable ChatToolRegistryInterface registry) {
        this.candidateApplicationService = candidateApplicationService;
        if (registry != null) {
            registry.register(this);
        }
    }

    @Override
    public String getName() {
        return TOOL_NAME;
    }

    @Override
    public AiToolDefinition getDefinition() {
        return new AiToolDefinition(
                TOOL_NAME,
                "Tra cứu danh sách hồ sơ việc làm đã nộp và tiến độ tuyển dụng của chính ứng viên đang đăng nhập hiện tại trên hệ thống",
                Map.of(),
                List.of());
    }

    @Override
    public ToolExecutionResult execute(Long callerUserId, Map<String, Object> arguments) {
        if (callerUserId == null) {
            return ToolExecutionResult.success(
                    "Bạn chưa đăng nhập tài khoản ứng viên. Để xem danh sách hồ sơ ứng tuyển và tiến độ phỏng vấn của mình, vui lòng đăng nhập vào hệ thống: [Đăng nhập ngay](/login).");
        }

        List<CandidateApplicationResult> applications =
                candidateApplicationService.getApplicationsByUserId(callerUserId, CAPPED_RESULTS);

        if (applications.isEmpty()) {
            return ToolExecutionResult.success(
                    "Bạn hiện chưa nộp hồ sơ ứng tuyển vào vị trí nào. Bạn có thể khám phá hàng ngàn cơ hội việc làm IT hấp dẫn tại: [Tất cả việc làm IT](/jobs).");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("<my_applications_data>\n");
        sb.append("Danh sách ")
                .append(applications.size())
                .append(" hồ sơ ứng tuyển gần nhất của bạn:\n\n");

        for (int i = 0; i < applications.size(); i++) {
            CandidateApplicationResult app = applications.get(i);
            sb.append(i + 1)
                    .append(". **")
                    .append(app.jobTitle())
                    .append("**\n")
                    .append("- **Công ty:** ")
                    .append(app.companyName())
                    .append("\n")
                    .append("- **Trạng thái:** ")
                    .append(app.status())
                    .append("\n")
                    .append("- **Ngày nộp hồ sơ:** ")
                    .append(app.appliedAt())
                    .append("\n")
                    .append("- **Hồ sơ chi tiết:** [Xem hồ sơ của tôi](")
                    .append(app.detailUrl())
                    .append(")\n\n");
        }
        sb.append("</my_applications_data>");

        return ToolExecutionResult.success(sb.toString().trim());
    }
}
