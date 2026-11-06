package com.techx.intervue.modules.ai.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.techx.intervue.modules.ai.requests.AiToolDefinition;
import com.techx.intervue.modules.ai.resources.CandidateApplicationResult;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.impl.JobSearchService;
import com.techx.intervue.modules.ai.services.impl.PlatformAgentToolService;
import com.techx.intervue.modules.ai.services.interfaces.CandidateApplicationServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CompanySearchServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.KnowledgeBaseServiceInterface;
import com.techx.intervue.modules.ai.tools.ChatToolRegistry;
import com.techx.intervue.modules.ai.tools.GetCompanyInfoTool;
import com.techx.intervue.modules.ai.tools.GetMyApplicationsTool;
import com.techx.intervue.modules.ai.tools.GetPlatformGuideTool;
import com.techx.intervue.modules.ai.tools.SearchJobsTool;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class PlatformAgentToolServiceTest {

    private ChatToolRegistry registry;
    private PlatformAgentToolService service;
    private CandidateApplicationServiceInterface candidateApplicationService;
    private CompanySearchServiceInterface companySearchService;
    private KnowledgeBaseServiceInterface knowledgeBaseService;

    @BeforeEach
    void setUp() {
        registry = new ChatToolRegistry();
        JobSearchService jobSearchService = new JobSearchService();
        companySearchService = mock(CompanySearchServiceInterface.class);
        candidateApplicationService = mock(CandidateApplicationServiceInterface.class);
        knowledgeBaseService = mock(KnowledgeBaseServiceInterface.class);

        // Self-registering tools
        new SearchJobsTool(jobSearchService, registry);
        new GetCompanyInfoTool(companySearchService, registry);
        new GetMyApplicationsTool(candidateApplicationService, registry);
        new GetPlatformGuideTool(knowledgeBaseService, registry);

        service = new PlatformAgentToolService(registry);
    }

    @Test
    @DisplayName("Should return definitions for all 4 available tools")
    void shouldReturnAvailableTools() {
        List<AiToolDefinition> tools = service.getAvailableTools();

        assertThat(tools).hasSize(4);
        List<String> names = tools.stream().map(AiToolDefinition::name).toList();
        assertThat(names)
                .containsExactly(
                        "search_jobs",
                        "get_company_info",
                        "get_my_applications",
                        "get_platform_guide");
    }

    @Test
    @DisplayName("Executing 'search_jobs' for remote Java jobs in HCM returns real jobs")
    void searchJobsToolExecution() {
        ToolExecutionResult result =
                service.execute(
                        "search_jobs",
                        null,
                        Map.of(
                                "keyword", "Java",
                                "location", "Ho Chi Minh City"));

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("Senior Java Backend Engineer (Remote - TP. HCM)");
        assertThat(result.content()).contains("/jobs/201");
    }

    @Test
    @DisplayName("Executing 'get_my_applications' while logged out asks to log in")
    void getMyApplicationsLoggedOut() {
        ToolExecutionResult result = service.execute("get_my_applications", null, Map.of());

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("Bạn chưa đăng nhập");
        assertThat(result.content()).contains("[Đăng nhập ngay](/login)");
    }

    @Test
    @DisplayName("Executing 'get_my_applications' with caller userId returns caller data")
    void getMyApplicationsLoggedIn() {
        when(candidateApplicationService.getApplicationsByUserId(5L, 3))
                .thenReturn(
                        List.of(
                                new CandidateApplicationResult(
                                        "app-5",
                                        "DevOps Engineer",
                                        "TechX Global",
                                        "Đang xét duyệt",
                                        "02/11/2026",
                                        "/candidate/profile")));

        ToolExecutionResult result = service.execute("get_my_applications", 5L, Map.of());

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("DevOps Engineer");
        assertThat(result.content()).contains("[Xem hồ sơ của tôi](/candidate/profile)");
    }

    @Test
    @DisplayName("Legacy aliases route to corresponding new canonical tools")
    void legacyAliasesRouting() {
        // search_companies -> get_company_info
        ToolExecutionResult compResult =
                service.execute("search_companies", null, Map.of("companyName", "TechX"));
        assertThat(compResult).isNotNull();

        // search_knowledge_base -> get_platform_guide
        ToolExecutionResult kbResult =
                service.execute("search_knowledge_base", null, Map.of("query", "tạo cv"));
        assertThat(kbResult.isSuccess()).isTrue();
        assertThat(kbResult.content()).contains("[Mẫu CV Chuẩn ATS](/cv-templates)");

        // suggest_navigation -> get_platform_guide
        ToolExecutionResult navResult =
                service.execute("suggest_navigation", null, Map.of("query", "luyện phỏng vấn"));
        assertThat(navResult.isSuccess()).isTrue();
        assertThat(navResult.content()).contains("[Định hướng & Phỏng vấn](/career-orientation)");
    }

    @Test
    @DisplayName("Unknown tool returns error")
    void unknownToolReturnsError() {
        ToolExecutionResult result = service.execute("delete_database", null, Map.of());

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.error()).isTrue();
        assertThat(result.content()).contains("Unknown tool: delete_database");
    }
}
