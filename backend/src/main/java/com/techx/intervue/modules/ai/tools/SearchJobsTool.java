package com.techx.intervue.modules.ai.tools;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.JobSearchResult;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.JobSearchServiceInterface;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

@Component
public class SearchJobsTool implements ChatTool {

    public static final String TOOL_NAME = "search_jobs";
    private static final int CAPPED_RESULTS = 3;

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
                "Skill, technology or IT job title keyword (for example: 'Java', 'NodeJS', 'React', 'DevOps', 'Python', 'Golang')");

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

        Map<String, Object> properties =
                Map.of("keyword", kwProp, "level", levelProp, "location", locProp);

        return new AiToolDefinition(
                TOOL_NAME,
                "Search open IT job posts on InterVue that match the candidate's skills, level or location",
                properties,
                List.of("keyword"));
    }

    @Override
    public ToolExecutionResult execute(Long callerUserId, Map<String, Object> arguments) {
        Map<String, Object> safeArgs = arguments != null ? arguments : Map.of();
        Object kwObj = safeArgs.get("keyword");
        if (kwObj == null || kwObj.toString().isBlank()) {
            return ToolExecutionResult.error("Missing required argument: keyword");
        }
        String keyword = kwObj.toString().trim();
        String level =
                safeArgs.get("level") != null ? safeArgs.get("level").toString().trim() : null;
        String location =
                safeArgs.get("location") != null
                        ? safeArgs.get("location").toString().trim()
                        : null;

        List<JobSearchResult> results =
                jobSearchService.search(keyword, level, location, CAPPED_RESULTS);

        if (results.isEmpty()) {
            return ToolExecutionResult.success(
                    "No IT jobs directly match the keyword: '"
                            + keyword
                            + "'. Guide the user to search on the jobs page: [All IT jobs](/jobs).");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("<job_search_results>\n");
        sb.append("Found ")
                .append(results.size())
                .append(" jobs matching the keyword '")
                .append(keyword)
                .append("':\n\n");

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
        sb.append("</job_search_results>");

        return ToolExecutionResult.success(sb.toString().trim());
    }
}
