package com.techx.intervue.modules.ai.tools;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.CompanySearchResult;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.CompanySearchServiceInterface;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class GetCompanyInfoTool implements ChatTool {

    public static final String TOOL_NAME = "get_company_info";
    private static final int CAPPED_RESULTS = 10;

    private final CompanySearchServiceInterface companySearchService;

    public GetCompanyInfoTool(CompanySearchServiceInterface companySearchService) {
        this(companySearchService, null);
    }

    @Autowired
    public GetCompanyInfoTool(
            CompanySearchServiceInterface companySearchService,
            @Nullable ChatToolRegistryInterface registry) {
        this.companySearchService = companySearchService;
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
        Map<String, Object> nameProp = new HashMap<>();
        nameProp.put("type", "STRING");
        nameProp.put(
                "description",
                "Tên công ty hoặc từ khóa lĩnh vực, công nghệ cần tra cứu (ví dụ: 'Viettel', 'FPT', 'VNG', 'TechX')");

        Map<String, Object> indProp = new HashMap<>();
        indProp.put("type", "STRING");
        indProp.put(
                "description",
                "Ngành nghề / Lĩnh vực hoạt động (ví dụ: 'IT - Phần mềm', 'Viễn thông', 'Ngân hàng', 'Game')");

        Map<String, Object> locProp = new HashMap<>();
        locProp.put("type", "STRING");
        locProp.put(
                "description",
                "Địa điểm đặt trụ sở hoặc chi nhánh: 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'");

        Map<String, Object> properties =
                Map.of("companyName", nameProp, "industry", indProp, "location", locProp);

        return new AiToolDefinition(
                TOOL_NAME,
                "Tra cứu hồ sơ doanh nghiệp tuyển dụng, quy mô, chế độ đãi ngộ, văn hóa làm việc và việc làm đang mở trên nền tảng InterVue",
                properties,
                List.of("companyName"));
    }

    @Override
    public ToolExecutionResult execute(Long callerUserId, Map<String, Object> arguments) {
        Map<String, Object> safeArgs = arguments != null ? arguments : Map.of();
        Object nameObj =
                safeArgs.get("companyName") != null
                        ? safeArgs.get("companyName")
                        : safeArgs.get("keyword");
        if (nameObj == null || nameObj.toString().isBlank()) {
            return ToolExecutionResult.error("Missing required argument: companyName");
        }
        String companyName = nameObj.toString().trim();
        String industry =
                safeArgs.get("industry") != null
                        ? safeArgs.get("industry").toString().trim()
                        : null;
        String location =
                safeArgs.get("location") != null
                        ? safeArgs.get("location").toString().trim()
                        : null;

        List<CompanySearchResult> results =
                companySearchService.search(companyName, industry, location, CAPPED_RESULTS);

        if (results.isEmpty()) {
            return ToolExecutionResult.success(
                    "Không tìm thấy doanh nghiệp phù hợp với từ khóa: '"
                            + companyName
                            + "'. Hãy gợi ý người dùng tìm việc làm theo tên công ty: [Tìm việc làm](/jobs?q="
                            + URLEncoder.encode(companyName, StandardCharsets.UTF_8)
                            + ").");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("<company_info_results>\n");
        sb.append("Tìm thấy ")
                .append(results.size())
                .append(" doanh nghiệp phù hợp với từ khóa '")
                .append(companyName)
                .append("':\n\n");

        for (int i = 0; i < results.size(); i++) {
            CompanySearchResult company = results.get(i);
            sb.append(i + 1)
                    .append(". **")
                    .append(company.name())
                    .append("**\n")
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
                    .append(" vị trí\n");
            if (!company.highlights().isEmpty()) {
                sb.append("- **Đãi ngộ nổi bật:** ")
                        .append(String.join(", ", company.highlights()))
                        .append("\n");
            }
            sb.append("- **Trang công ty:** [Xem chi tiết doanh nghiệp & việc làm](")
                    .append(company.detailUrl())
                    .append(")\n\n");
        }
        if (results.size() >= CAPPED_RESULTS) {
            sb.append("Đây là ")
                    .append(CAPPED_RESULTS)
                    .append(
                            " kết quả đầu tiên, có thể còn nhiều doanh nghiệp khác. Hãy mời người dùng nêu tên công ty hoặc lĩnh vực cụ thể hơn để tìm chính xác.\n");
        }
        sb.append("</company_info_results>");

        return ToolExecutionResult.success(sb.toString().trim());
    }
}
