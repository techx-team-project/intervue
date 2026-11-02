package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.CompanySearchResult;
import com.techx.intervue.modules.ai.resources.JobSearchResult;
import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.CompanySearchServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.JobSearchServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.KnowledgeBaseServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PlatformAgentToolServiceInterface;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformAgentToolService implements PlatformAgentToolServiceInterface {

    public static final String TOOL_SEARCH_KNOWLEDGE = "search_knowledge_base";
    public static final String TOOL_SEARCH_JOBS = "search_jobs";
    public static final String TOOL_SEARCH_COMPANIES = "search_companies";
    public static final String TOOL_SUGGEST_NAVIGATION = "suggest_navigation";

    private final KnowledgeBaseServiceInterface knowledgeBaseService;
    private final JobSearchServiceInterface jobSearchService;
    private final CompanySearchServiceInterface companySearchService;

    @Override
    public List<AiToolDefinition> getAvailableTools() {
        return List.of(
                buildSearchKnowledgeTool(),
                buildSearchJobsTool(),
                buildSearchCompaniesTool(),
                buildSuggestNavigationTool());
    }

    @Override
    public ToolExecutionResult execute(String toolName, Map<String, Object> arguments) {
        if (toolName == null) {
            return ToolExecutionResult.error("Tool name must not be null");
        }
        Map<String, Object> safeArgs = arguments != null ? arguments : Map.of();

        return switch (toolName) {
            case TOOL_SEARCH_KNOWLEDGE -> handleSearchKnowledge(safeArgs);
            case TOOL_SEARCH_JOBS -> handleSearchJobs(safeArgs);
            case TOOL_SEARCH_COMPANIES -> handleSearchCompanies(safeArgs);
            case TOOL_SUGGEST_NAVIGATION -> handleSuggestNavigation(safeArgs);
            default -> ToolExecutionResult.error("Unknown tool: " + toolName);
        };
    }

    private ToolExecutionResult handleSearchKnowledge(Map<String, Object> arguments) {
        Object queryObj = arguments.get("query");
        if (queryObj == null || queryObj.toString().isBlank()) {
            return ToolExecutionResult.error("Missing required argument: query");
        }
        String query = queryObj.toString().trim();

        List<KnowledgeMatch> matches = knowledgeBaseService.retrieve(query, 3, 0.45);
        if (matches.isEmpty()) {
            return ToolExecutionResult.success(
                    "Không tìm thấy tài liệu phù hợp trực tiếp với từ khóa: '"
                            + query
                            + "'. Vui lòng hướng dẫn người dùng dựa trên thông tin nền tảng chung hoặc gợi ý liên hệ bộ phận hỗ trợ.");
        }

        StringBuilder sb = new StringBuilder();
        List<String> sources = new ArrayList<>();

        for (KnowledgeMatch match : matches) {
            String sourceTag = match.documentName() + " - " + match.heading();
            sources.add(sourceTag);
            sb.append("--- SOURCE: ").append(sourceTag).append(" ---\n");
            sb.append(match.content()).append("\n\n");
        }

        return ToolExecutionResult.success(sb.toString().trim(), sources);
    }

    private ToolExecutionResult handleSearchJobs(Map<String, Object> arguments) {
        Object kwObj = arguments.get("keyword");
        if (kwObj == null || kwObj.toString().isBlank()) {
            return ToolExecutionResult.error("Missing required argument: keyword");
        }
        String keyword = kwObj.toString().trim();
        String level =
                arguments.get("level") != null ? arguments.get("level").toString().trim() : null;
        String location =
                arguments.get("location") != null
                        ? arguments.get("location").toString().trim()
                        : null;

        List<JobSearchResult> results = jobSearchService.search(keyword, level, location, 3);
        if (results.isEmpty()) {
            return ToolExecutionResult.success(
                    "Không tìm thấy việc làm IT phù hợp trực tiếp với từ khóa: '"
                            + keyword
                            + "'. Hãy hướng dẫn người dùng tìm kiếm trên trang việc làm: [Tất cả việc làm IT](/jobs).");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Tìm thấy ")
                .append(results.size())
                .append(" việc làm phù hợp với từ khóa '")
                .append(keyword)
                .append("':\n\n");

        for (int i = 0; i < results.size(); i++) {
            JobSearchResult job = results.get(i);
            sb.append(i + 1)
                    .append(". **")
                    .append(job.title())
                    .append("**\n")
                    .append("- **Công ty:** ")
                    .append(job.company())
                    .append("\n")
                    .append("- **Mức lương:** ")
                    .append(job.salary())
                    .append("\n")
                    .append("- **Địa điểm:** ")
                    .append(job.location())
                    .append("\n")
                    .append("- **Kỹ năng chính:** ")
                    .append(String.join(", ", job.skills()))
                    .append("\n")
                    .append("- **Mô tả:** ")
                    .append(job.description())
                    .append("\n")
                    .append("- **Đường dẫn ứng tuyển:** [Xem chi tiết & Ứng tuyển ngay](")
                    .append(job.detailUrl())
                    .append(")\n\n");
        }

        return ToolExecutionResult.success(sb.toString().trim());
    }

    private ToolExecutionResult handleSearchCompanies(Map<String, Object> arguments) {
        Object kwObj = arguments.get("keyword");
        if (kwObj == null || kwObj.toString().isBlank()) {
            return ToolExecutionResult.error("Missing required argument: keyword");
        }
        String keyword = kwObj.toString().trim();
        String industry =
                arguments.get("industry") != null
                        ? arguments.get("industry").toString().trim()
                        : null;
        String location =
                arguments.get("location") != null
                        ? arguments.get("location").toString().trim()
                        : null;

        List<CompanySearchResult> results =
                companySearchService.search(keyword, industry, location, 3);
        if (results.isEmpty()) {
            return ToolExecutionResult.success(
                    "Không tìm thấy doanh nghiệp phù hợp với từ khóa: '"
                            + keyword
                            + "'. Hãy gợi ý người dùng xem danh sách các nhà tuyển dụng hàng đầu trên nền tảng: [Danh sách Doanh nghiệp](/companies).");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Tìm thấy ")
                .append(results.size())
                .append(" doanh nghiệp phù hợp với từ khóa '")
                .append(keyword)
                .append("':\n\n");

        for (int i = 0; i < results.size(); i++) {
            CompanySearchResult company = results.get(i);
            sb.append(i + 1)
                    .append(". **")
                    .append(company.name())
                    .append("**")
                    .append(
                            company.isVerified()
                                    ? " *(Đã xác thực giấy phép - Tick xanh)*\n"
                                    : "\n")
                    .append("- **Lĩnh vực:** ")
                    .append(company.industry())
                    .append("\n")
                    .append("- **Quy mô:** ")
                    .append(company.size())
                    .append("\n")
                    .append("- **Địa chỉ:** ")
                    .append(company.address())
                    .append("\n")
                    .append("- **Việc làm đang tuyển:** ")
                    .append(company.openJobsCount())
                    .append(" vị trí\n")
                    .append("- **Đãi ngộ nổi bật:** ")
                    .append(String.join(", ", company.highlights()))
                    .append("\n")
                    .append("- **Trang công ty:** [Xem chi tiết doanh nghiệp & việc làm](")
                    .append(company.detailUrl())
                    .append(")\n\n");
        }

        return ToolExecutionResult.success(sb.toString().trim());
    }

    private ToolExecutionResult handleSuggestNavigation(Map<String, Object> arguments) {
        Object featObj = arguments.get("feature");
        String feature = featObj != null ? featObj.toString().trim().toLowerCase(Locale.ROOT) : "";

        return switch (feature) {
            case "cv_builder", "cv", "resume" ->
                    ToolExecutionResult.success(
                            "Tính năng: Kho Mẫu CV Chuẩn ATS\nĐường dẫn: /cv-templates\nMô tả: Lựa chọn mẫu CV IT chuyên nghiệp, tối ưu ATS và nhận đánh giá phản hồi từ AI.");
            case "mock_interview", "interview" ->
                    ToolExecutionResult.success(
                            "Tính năng: Luyện Phỏng Vấn Giả Lập AI 1:1\nĐường dẫn: /career-orientation\nMô tả: Luyện tập trả lời các câu hỏi phỏng vấn kỹ thuật và tình huống thực tế theo vị trí tuyển dụng.");
            case "job_search", "jobs" ->
                    ToolExecutionResult.success(
                            "Tính năng: Tìm Kiếm Việc Làm IT\nĐường dẫn: /jobs\nMô tả: Khám phá hàng ngàn cơ hội việc làm IT lương cao đãi ngộ tốt và việc làm gần bạn qua bản đồ.");
            case "mascot_studio", "mascot" ->
                    ToolExecutionResult.success(
                            "Tính năng: Studio 3D InterVue Bot\nĐường dẫn: /mascot\nMô tả: Trải nghiệm không gian 3D tương tác và tùy biến chú robot trợ lý InterVue.");
            case "company_verification", "verify_company" ->
                    ToolExecutionResult.success(
                            "Tính năng: Xác Thực Doanh Nghiệp (Dành cho Nhà tuyển dụng)\nĐường dẫn: /recruiter/company/verification\nMô tả: Tải lên giấy phép ĐKKD và thông tin pháp lý để nhận tick xanh doanh nghiệp uy tín.");
            case "pricing", "upgrade" ->
                    ToolExecutionResult.success(
                            "Tính năng: Nâng Cấp Gói Dịch Vụ\nĐường dẫn: /account/upgrade\nMô tả: Bảng giá chi tiết và các quyền lợi dành riêng cho tài khoản ứng viên Pro và nhà tuyển dụng.");
            default ->
                    ToolExecutionResult.success(
                            "Tính năng: Trang Chủ InterVue\nĐường dẫn: /\nMô tả: Cổng thông tin công nghệ tuyển dụng & phỏng vấn AI thông minh.");
        };
    }

    private AiToolDefinition buildSearchKnowledgeTool() {
        Map<String, Object> queryProp = new HashMap<>();
        queryProp.put("type", "STRING");
        queryProp.put(
                "description",
                "Từ khóa hoặc câu hỏi cần tra cứu trong tài liệu nền tảng InterVue (ví dụ: 'quy trình xác thực doanh nghiệp', 'cách tạo CV', 'chính sách bảo mật')");

        Map<String, Object> properties = Map.of("query", queryProp);
        return new AiToolDefinition(
                TOOL_SEARCH_KNOWLEDGE,
                "Tra cứu thông tin chính sách, tài liệu hướng dẫn, quy trình sử dụng trên nền tảng InterVue",
                properties,
                List.of("query"));
    }

    private AiToolDefinition buildSearchJobsTool() {
        Map<String, Object> kwProp = new HashMap<>();
        kwProp.put("type", "STRING");
        kwProp.put(
                "description",
                "Từ khóa kỹ năng, công nghệ hoặc vị trí tuyển dụng IT (ví dụ: 'NodeJS', 'Java', 'React', 'DevOps', 'Python', 'Golang', 'Frontend', 'Backend')");

        Map<String, Object> levelProp = new HashMap<>();
        levelProp.put("type", "STRING");
        levelProp.put(
                "description",
                "Cấp bậc kinh nghiệm mong muốn: 'intern', 'fresher', 'junior', 'mid', 'senior', 'lead'");

        Map<String, Object> locProp = new HashMap<>();
        locProp.put("type", "STRING");
        locProp.put(
                "description", "Địa điểm làm việc: 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Remote'");

        Map<String, Object> properties =
                Map.of("keyword", kwProp, "level", levelProp, "location", locProp);

        return new AiToolDefinition(
                TOOL_SEARCH_JOBS,
                "Tìm kiếm các tin tuyển dụng việc làm IT đang mở trên nền tảng InterVue phù hợp với kỹ năng, cấp bậc hoặc địa điểm của ứng viên",
                properties,
                List.of("keyword"));
    }

    private AiToolDefinition buildSearchCompaniesTool() {
        Map<String, Object> kwProp = new HashMap<>();
        kwProp.put("type", "STRING");
        kwProp.put(
                "description",
                "Tên công ty hoặc từ khóa lĩnh vực, công nghệ cần tìm kiếm (ví dụ: 'Viettel', 'FPT', 'VNG', 'Techcombank', 'Fintech', 'IT')");

        Map<String, Object> indProp = new HashMap<>();
        indProp.put("type", "STRING");
        indProp.put(
                "description",
                "Ngành nghề / Lĩnh vực hoạt động (ví dụ: 'IT - Phần mềm', 'Ngân hàng', 'Viễn thông', 'Game', 'Thương mại điện tử')");

        Map<String, Object> locProp = new HashMap<>();
        locProp.put("type", "STRING");
        locProp.put(
                "description",
                "Địa điểm đặt trụ sở hoặc chi nhánh: 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'");

        Map<String, Object> properties =
                Map.of("keyword", kwProp, "industry", indProp, "location", locProp);

        return new AiToolDefinition(
                TOOL_SEARCH_COMPANIES,
                "Tra cứu hồ sơ doanh nghiệp tuyển dụng, quy mô, chế độ đãi ngộ, văn hóa làm việc và việc làm đang mở trên nền tảng InterVue",
                properties,
                List.of("keyword"));
    }

    private AiToolDefinition buildSuggestNavigationTool() {
        Map<String, Object> featProp = new HashMap<>();
        featProp.put("type", "STRING");
        featProp.put(
                "description",
                "Mã tính năng cần điều hướng: 'cv_builder', 'mock_interview', 'job_search', 'mascot_studio', 'company_verification', 'pricing'");

        Map<String, Object> properties = Map.of("feature", featProp);
        return new AiToolDefinition(
                TOOL_SUGGEST_NAVIGATION,
                "Lấy thông tin và đường dẫn URL điều hướng nhanh đến trang tính năng cụ thể trên nền tảng InterVue",
                properties,
                List.of("feature"));
    }
}
