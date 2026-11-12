package com.techx.intervue.modules.ai.tools;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.JobSearchResult;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.JobSearchServiceInterface;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.StringJoiner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class SearchJobsTool implements ChatTool {

    public static final String TOOL_NAME = "search_jobs";
    private static final int CAPPED_RESULTS = 10;
    private static final Set<String> LIST_SORTS = Set.of("NEWEST", "SALARY_DESC", "DEADLINE_ASC");

    private final JobSearchServiceInterface jobSearchService;

    public SearchJobsTool(JobSearchServiceInterface jobSearchService) {
        this(jobSearchService, null);
    }

    @Autowired
    public SearchJobsTool(
            JobSearchServiceInterface jobSearchService,
            @Nullable ChatToolRegistryInterface registry) {
        this.jobSearchService = jobSearchService;
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
        Map<String, Object> kwProp = new HashMap<>();
        kwProp.put("type", "STRING");
        kwProp.put(
                "description",
                "Từ khóa kỹ năng, công nghệ hoặc vị trí tuyển dụng IT (ví dụ: 'Java', 'NodeJS', 'React', 'DevOps', 'Python', 'Golang'). Bỏ trống nếu người dùng không nêu kỹ năng hay vị trí cụ thể");

        Map<String, Object> levelProp = new HashMap<>();
        levelProp.put("type", "STRING");
        levelProp.put(
                "description",
                "Cấp bậc mong muốn: 'intern', 'fresher', 'junior', 'mid', 'senior', 'lead'");

        Map<String, Object> locProp = new HashMap<>();
        locProp.put("type", "STRING");
        locProp.put(
                "description",
                "Địa điểm hoặc hình thức làm việc: 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Remote'");

        Map<String, Object> sortProp = new HashMap<>();
        sortProp.put("type", "STRING");
        sortProp.put("enum", List.of("RECOMMENDED", "NEWEST", "SALARY_DESC", "DEADLINE_ASC"));
        sortProp.put(
                "description",
                "Cách sắp xếp: 'NEWEST' khi người dùng muốn việc làm mới nhất, 'SALARY_DESC' lương cao nhất, 'DEADLINE_ASC' sắp hết hạn nộp, mặc định 'RECOMMENDED'");

        Map<String, Object> properties =
                Map.of(
                        "keyword", kwProp,
                        "level", levelProp,
                        "location", locProp,
                        "sort", sortProp);

        return new AiToolDefinition(
                TOOL_NAME,
                "Tìm kiếm các tin tuyển dụng việc làm IT đang mở trên nền tảng InterVue phù hợp với kỹ năng, cấp bậc hoặc địa điểm của ứng viên",
                properties,
                List.of());
    }

    @Override
    public ToolExecutionResult execute(Long callerUserId, Map<String, Object> arguments) {
        Map<String, Object> safeArgs = arguments != null ? arguments : Map.of();
        Object kwObj = safeArgs.get("keyword");
        String keyword =
                kwObj != null && !kwObj.toString().isBlank() ? kwObj.toString().trim() : null;
        String level =
                safeArgs.get("level") != null ? safeArgs.get("level").toString().trim() : null;
        String location =
                safeArgs.get("location") != null
                        ? safeArgs.get("location").toString().trim()
                        : null;

        String sort = safeArgs.get("sort") != null ? safeArgs.get("sort").toString().trim() : null;

        List<JobSearchResult> results =
                jobSearchService.search(keyword, level, location, sort, CAPPED_RESULTS);
        String criteria = keyword != null ? "từ khóa '" + keyword + "'" : "tiêu chí đã chọn";

        if (results.isEmpty()) {
            return ToolExecutionResult.success(
                    "Không tìm thấy việc làm IT phù hợp trực tiếp với "
                            + criteria
                            + ". Hãy hướng dẫn người dùng tìm kiếm trên trang việc làm: [Tất cả việc làm IT](/jobs).");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("<job_search_results>\n");
        sb.append("Tìm thấy ")
                .append(results.size())
                .append(" việc làm phù hợp với ")
                .append(criteria)
                .append(":\n\n");

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
        if (results.size() >= CAPPED_RESULTS) {
            sb.append("Đây là ")
                    .append(CAPPED_RESULTS)
                    .append(
                            " kết quả đầu tiên, có thể còn nhiều việc làm khác. Hãy kết thúc câu trả lời bằng dòng: [Xem thêm việc làm](")
                    .append(listUrl(keyword, location, sort))
                    .append(")\n");
        }
        sb.append("</job_search_results>");

        return ToolExecutionResult.success(sb.toString().trim());
    }

    private String listUrl(String keyword, String location, String sort) {
        StringJoiner query = new StringJoiner("&");
        if (keyword != null) {
            query.add("q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8));
        }
        if (location != null && !location.isBlank()) {
            query.add("city=" + URLEncoder.encode(location, StandardCharsets.UTF_8));
        }
        String normalizedSort = sort != null ? sort.toUpperCase(Locale.ROOT) : null;
        if (normalizedSort != null && LIST_SORTS.contains(normalizedSort)) {
            query.add("sort=" + normalizedSort);
        }
        return query.length() == 0 ? "/jobs" : "/jobs?" + query;
    }
}
