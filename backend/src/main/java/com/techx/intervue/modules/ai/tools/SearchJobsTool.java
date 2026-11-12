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
                "Skill, technology or IT job title keyword (for example: 'Java', 'NodeJS', 'React', 'DevOps', 'Python', 'Golang'). Leave empty if the user names no specific skill or position");

        Map<String, Object> levelProp = new HashMap<>();
        levelProp.put("type", "STRING");
        levelProp.put(
                "description",
                "Desired level: 'intern', 'fresher', 'junior', 'mid', 'senior', 'lead'");

        Map<String, Object> locProp = new HashMap<>();
        locProp.put("type", "STRING");
        locProp.put(
                "description",
                "Location or work arrangement: 'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Remote'");

        Map<String, Object> sortProp = new HashMap<>();
        sortProp.put("type", "STRING");
        sortProp.put("enum", List.of("RECOMMENDED", "NEWEST", "SALARY_DESC", "DEADLINE_ASC"));
        sortProp.put(
                "description",
                "Sort order: 'NEWEST' for the newest jobs, 'SALARY_DESC' for the highest salary, 'DEADLINE_ASC' for jobs closing soon, default 'RECOMMENDED'");

        Map<String, Object> properties =
                Map.of(
                        "keyword", kwProp,
                        "level", levelProp,
                        "location", locProp,
                        "sort", sortProp);

        return new AiToolDefinition(
                TOOL_NAME,
                "Search open IT jobs on the InterVue platform that match the candidate's skills, level or location",
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
        String criteria =
                keyword != null ? "the keyword '" + keyword + "'" : "the selected criteria";

        if (results.isEmpty()) {
            return ToolExecutionResult.success(
                    "No IT jobs directly match "
                            + criteria
                            + ". Guide the user to search on the jobs page: [All IT jobs](/jobs).");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("<job_search_results>\n");
        sb.append("Found ")
                .append(results.size())
                .append(" jobs matching ")
                .append(criteria)
                .append(":\n\n");

        for (int i = 0; i < results.size(); i++) {
            JobSearchResult job = results.get(i);
            sb.append(i + 1)
                    .append(". **")
                    .append(job.title())
                    .append("**\n")
                    .append("- **Company:** ")
                    .append(job.company())
                    .append("\n")
                    .append("- **Salary:** ")
                    .append(job.salary())
                    .append("\n")
                    .append("- **Location:** ")
                    .append(job.location())
                    .append("\n")
                    .append("- **Key skills:** ")
                    .append(String.join(", ", job.skills()))
                    .append("\n")
                    .append("- **Description:** ")
                    .append(job.description())
                    .append("\n")
                    .append("- **Apply link:** [View details & apply now](")
                    .append(job.detailUrl())
                    .append(")\n\n");
        }
        if (results.size() >= CAPPED_RESULTS) {
            sb.append("These are the first ")
                    .append(CAPPED_RESULTS)
                    .append(
                            " results, there may be more jobs. End the answer with this line: [See more jobs](")
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
