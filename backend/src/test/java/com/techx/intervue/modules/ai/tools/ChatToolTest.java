package com.techx.intervue.modules.ai.tools;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.techx.intervue.modules.ai.resources.CandidateApplicationResult;
import com.techx.intervue.modules.ai.resources.CompanySearchResult;
import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.impl.JobSearchService;
import com.techx.intervue.modules.ai.services.interfaces.CandidateApplicationServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CompanySearchServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.KnowledgeBaseServiceInterface;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ChatToolTest {

    private ChatToolRegistry registry;
    private JobSearchService jobSearchService;
    private CompanySearchServiceInterface companySearchService;
    private CandidateApplicationServiceInterface candidateApplicationService;
    private KnowledgeBaseServiceInterface knowledgeBaseService;

    @BeforeEach
    void setUp() {
        registry = new ChatToolRegistry();
        jobSearchService = new JobSearchService();
        companySearchService = mock(CompanySearchServiceInterface.class);
        candidateApplicationService = mock(CandidateApplicationServiceInterface.class);
        knowledgeBaseService = mock(KnowledgeBaseServiceInterface.class);
    }

    @Test
    @DisplayName("Tools register themselves automatically into ChatToolRegistry")
    void toolsShouldRegisterThemselves() {
        SearchJobsTool searchJobsTool = new SearchJobsTool(jobSearchService, registry);
        GetCompanyInfoTool getCompanyInfoTool =
                new GetCompanyInfoTool(companySearchService, registry);
        GetMyApplicationsTool getMyApplicationsTool =
                new GetMyApplicationsTool(candidateApplicationService, registry);
        GetPlatformGuideTool getPlatformGuideTool =
                new GetPlatformGuideTool(knowledgeBaseService, registry);

        assertThat(registry.find(SearchJobsTool.TOOL_NAME)).contains(searchJobsTool);
        assertThat(registry.find(GetCompanyInfoTool.TOOL_NAME)).contains(getCompanyInfoTool);
        assertThat(registry.find(GetMyApplicationsTool.TOOL_NAME)).contains(getMyApplicationsTool);
        assertThat(registry.find(GetPlatformGuideTool.TOOL_NAME)).contains(getPlatformGuideTool);
        assertThat(registry.getAll()).hasSize(4);
    }

    @Test
    @DisplayName("Find remote Java jobs in Ho Chi Minh City returns real jobs")
    void searchJobsShouldReturnRealRemoteJavaJobsInHcm() {
        SearchJobsTool tool = new SearchJobsTool(jobSearchService, registry);

        // Case 1: Separate keyword and location
        ToolExecutionResult result1 =
                tool.execute(
                        null,
                        Map.of(
                                "keyword", "Java",
                                "location", "Ho Chi Minh City"));

        assertThat(result1.isSuccess()).isTrue();
        assertThat(result1.content()).contains("<job_search_results>");
        assertThat(result1.content()).contains("Senior Java Backend Engineer (Remote - TP. HCM)");
        assertThat(result1.content())
                .contains("Java Software Engineer (Microservices / Cloud - Remote)");
        assertThat(result1.content()).contains("/jobs/201");
        assertThat(result1.content()).contains("/jobs/202");

        // Case 2: Full query as keyword
        ToolExecutionResult result2 =
                tool.execute(null, Map.of("keyword", "Find remote Java jobs in Ho Chi Minh City"));

        assertThat(result2.isSuccess()).isTrue();
        assertThat(result2.content()).contains("Senior Java Backend Engineer (Remote - TP. HCM)");
        assertThat(result2.content()).contains("/jobs/201");
    }

    @Test
    @DisplayName("SearchJobsTool returns error when keyword is missing")
    void searchJobsShouldReturnErrorWhenKeywordMissing() {
        SearchJobsTool tool = new SearchJobsTool(jobSearchService, registry);
        ToolExecutionResult result = tool.execute(null, Map.of());

        assertThat(result.isSuccess()).isFalse();
        assertThat(result.error()).isTrue();
        assertThat(result.content()).contains("Missing required argument: keyword");
    }

    @Test
    @DisplayName("Asking about my applications while logged out asks user to log in")
    void getMyApplicationsWhileLoggedOutAsksToLogin() {
        GetMyApplicationsTool tool =
                new GetMyApplicationsTool(candidateApplicationService, registry);

        ToolExecutionResult result = tool.execute(null, Map.of());

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("Bạn chưa đăng nhập tài khoản ứng viên");
        assertThat(result.content()).contains("[Đăng nhập ngay](/login)");
    }

    @Test
    @DisplayName(
            "Asking about my applications while logged in returns caller's applications with deep links")
    void getMyApplicationsWhileLoggedInReturnsApplications() {
        when(candidateApplicationService.getApplicationsByUserId(10L, 3))
                .thenReturn(
                        List.of(
                                new CandidateApplicationResult(
                                        "app-1",
                                        "Java Backend Engineer",
                                        "TechX Global",
                                        "Đang xem xét",
                                        "01/11/2026",
                                        "/candidate/profile")));

        GetMyApplicationsTool tool =
                new GetMyApplicationsTool(candidateApplicationService, registry);

        // Even if arguments contain malicious spoofed userId, tool only uses callerUserId
        ToolExecutionResult result =
                tool.execute(10L, Map.of("userId", 999L, "candidateId", "malicious"));

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("<my_applications_data>");
        assertThat(result.content()).contains("Java Backend Engineer");
        assertThat(result.content()).contains("TechX Global");
        assertThat(result.content()).contains("[Xem hồ sơ của tôi](/candidate/profile)");
    }

    @Test
    @DisplayName("GetCompanyInfoTool returns company details with deep links")
    void getCompanyInfoReturnsDetails() {
        when(companySearchService.search("TechX", null, null, 3))
                .thenReturn(
                        List.of(
                                new CompanySearchResult(
                                        "1",
                                        "Công ty Cổ phần Công nghệ TechX Global",
                                        "IT - Phần mềm",
                                        "150 - 300 nhân viên",
                                        "Hà Nội",
                                        "https://techx.com",
                                        true,
                                        12,
                                        List.of("Lương tháng 13", "Bảo hiểm PVI"),
                                        "/companies/1")));

        GetCompanyInfoTool tool = new GetCompanyInfoTool(companySearchService, registry);

        ToolExecutionResult result = tool.execute(null, Map.of("companyName", "TechX"));

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("<company_info_results>");
        assertThat(result.content()).contains("Công ty Cổ phần Công nghệ TechX Global");
        assertThat(result.content())
                .contains("[Xem chi tiết doanh nghiệp & việc làm](/companies/1)");
    }

    @Test
    @DisplayName("GetPlatformGuideTool returns quick navigation deep links")
    void getPlatformGuideReturnsQuickNav() {
        GetPlatformGuideTool tool = new GetPlatformGuideTool(knowledgeBaseService, registry);

        ToolExecutionResult result = tool.execute(null, Map.of("query", "tạo cv chuẩn ats"));

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("[Mẫu CV Chuẩn ATS](/cv-templates)");
    }

    @Test
    @DisplayName(
            "GetPlatformGuideTool retrieves knowledge base content when not a quick navigation match")
    void getPlatformGuideRetrievesKb() {
        when(knowledgeBaseService.retrieve(anyString(), anyInt(), anyDouble()))
                .thenReturn(
                        List.of(
                                new KnowledgeMatch(
                                        "recruiter_guide.md",
                                        "Quy trình duyệt tin",
                                        "Tin tuyển dụng được duyệt trong vòng 24h.",
                                        0.88)));

        GetPlatformGuideTool tool = new GetPlatformGuideTool(knowledgeBaseService, registry);

        ToolExecutionResult result =
                tool.execute(null, Map.of("query", "quy trình duyệt tin đăng"));

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("<platform_guide_data>");
        assertThat(result.content()).contains("recruiter_guide.md - Quy trình duyệt tin");
        assertThat(result.sources()).contains("recruiter_guide.md - Quy trình duyệt tin");
    }
}
