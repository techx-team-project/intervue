package com.techx.intervue.modules.ai.tools;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.KnowledgeBaseServiceInterface;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class GetPlatformGuideTool implements ChatTool {

    public static final String TOOL_NAME = "get_platform_guide";
    private static final int CAPPED_RESULTS = 3;
    private static final double MIN_SCORE_THRESHOLD = 0.45;

    private final KnowledgeBaseServiceInterface knowledgeBaseService;

    public GetPlatformGuideTool(KnowledgeBaseServiceInterface knowledgeBaseService) {
        this(knowledgeBaseService, null);
    }

    @Autowired
    public GetPlatformGuideTool(
            KnowledgeBaseServiceInterface knowledgeBaseService,
            @Nullable ChatToolRegistryInterface registry) {
        this.knowledgeBaseService = knowledgeBaseService;
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
        Map<String, Object> queryProp = new HashMap<>();
        queryProp.put("type", "STRING");
        queryProp.put(
                "description",
                "Từ khóa hoặc câu hỏi cần tra cứu hướng dẫn sử dụng, chính sách nền tảng, điều khoản bảo vệ dữ liệu hoặc điều hướng tính năng trên InterVue (ví dụ: 'cách tạo CV', 'xác thực doanh nghiệp', 'bảo vệ dữ liệu cá nhân', 'nâng cấp gói')");

        Map<String, Object> properties = Map.of("query", queryProp);
        return new AiToolDefinition(
                TOOL_NAME,
                "Tra cứu tài liệu hướng dẫn, quy trình sử dụng, chính sách và đường dẫn điều hướng nhanh đến các tính năng trên InterVue",
                properties,
                List.of("query"));
    }

    @Override
    public ToolExecutionResult execute(Long callerUserId, Map<String, Object> arguments) {
        Map<String, Object> safeArgs = arguments != null ? arguments : Map.of();
        Object queryObj =
                safeArgs.get("query") != null ? safeArgs.get("query") : safeArgs.get("feature");
        if (queryObj == null || queryObj.toString().isBlank()) {
            return ToolExecutionResult.error("Missing required argument: query");
        }
        String query = queryObj.toString().trim();

        String quickNav = matchQuickNavigation(query);
        if (quickNav != null) {
            return ToolExecutionResult.success(quickNav);
        }

        List<KnowledgeMatch> matches =
                knowledgeBaseService.retrieve(query, CAPPED_RESULTS, MIN_SCORE_THRESHOLD);
        if (matches.isEmpty()) {
            return ToolExecutionResult.success(
                    "Không tìm thấy tài liệu phù hợp trực tiếp với từ khóa: '"
                            + query
                            + "'. Hãy tham khảo thêm thông tin tại các chuyên mục: [Mẫu CV ATS](/cv-templates), [Định hướng nghề nghiệp](/career-orientation), [Thỏa thuận dữ liệu](/data-processing-agreement).");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("<platform_guide_data>\n");
        List<String> sources = new ArrayList<>();

        for (KnowledgeMatch match : matches) {
            String sourceTag = match.documentName() + " - " + match.heading();
            sources.add(sourceTag);
            sb.append("--- SOURCE: ").append(sourceTag).append(" ---\n");
            sb.append(match.content()).append("\n\n");
        }
        sb.append("</platform_guide_data>");

        return ToolExecutionResult.success(sb.toString().trim(), sources);
    }

    private String matchQuickNavigation(String query) {
        String lower = query.toLowerCase(Locale.ROOT);
        if (lower.contains("cv") || lower.contains("mẫu") || lower.contains("template")) {
            return "Tính năng: Kho Mẫu CV Chuẩn ATS\nĐường dẫn: [Mẫu CV Chuẩn ATS](/cv-templates)\nMô tả: Lựa chọn mẫu CV IT chuyên nghiệp, tối ưu hệ thống lọc ATS và nhận gợi ý chỉnh sửa từ AI.";
        }
        if (lower.contains("phỏng vấn")
                || lower.contains("interview")
                || lower.contains("định hướng")
                || lower.contains("career")) {
            return "Tính năng: Luyện Phỏng Vấn Giả Lập AI 1:1 & Định Hướng Nghề Nghiệp\nĐường dẫn: [Định hướng & Phỏng vấn](/career-orientation)\nMô tả: Luyện tập trả lời các câu hỏi phỏng vấn kỹ thuật và tình huống thực tế theo vị trí tuyển dụng.";
        }
        if (lower.contains("việc làm") || lower.contains("tìm việc") || lower.contains("jobs")) {
            return "Tính năng: Tìm Kiếm Việc Làm IT\nĐường dẫn: [Tất cả việc làm IT](/jobs)\nMô tả: Khám phá hàng ngàn cơ hội việc làm IT lương cao và đãi ngộ tốt.";
        }
        if (lower.contains("bảo vệ dữ liệu")
                || lower.contains("nghị định 13")
                || lower.contains("chính sách")
                || lower.contains("privacy")
                || lower.contains("agreement")) {
            return "Tính năng: Thỏa Thuận Bảo Vệ Dữ Liệu Cá Nhân\nĐường dẫn: [Thỏa thuận xử lý dữ liệu](/data-processing-agreement)\nMô tả: Tuân thủ Luật Bảo vệ dữ liệu cá nhân và Nghị định 13/2023/NĐ-CP.";
        }
        if (lower.contains("xác thực")
                || lower.contains("doanh nghiệp")
                || lower.contains("verify")
                || lower.contains("giấy phép")) {
            return "Tính năng: Xác Thực Doanh Nghiệp (Dành cho Nhà tuyển dụng)\nĐường dẫn: [Xác thực doanh nghiệp](/recruiter/company/verification)\nMô tả: Tải lên giấy phép ĐKKD và thông tin pháp lý để nhận tick xanh doanh nghiệp uy tín.";
        }
        if (lower.contains("nâng cấp")
                || lower.contains("bảng giá")
                || lower.contains("pricing")
                || lower.contains("gói")) {
            return "Tính năng: Nâng Cấp Gói Dịch Vụ\nĐường dẫn: [Bảng giá & Gói dịch vụ](/account/upgrade)\nMô tả: Bảng giá chi tiết và các quyền lợi dành riêng cho tài khoản ứng viên Pro và nhà tuyển dụng.";
        }
        return null;
    }
}
