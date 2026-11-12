package com.techx.intervue.modules.ai.tools;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.techx.intervue.modules.ai.resources.CandidateApplicationResult;
import com.techx.intervue.modules.ai.resources.CompanySearchResult;
import com.techx.intervue.modules.ai.resources.JobSearchResult;
import com.techx.intervue.modules.ai.resources.KnowledgeMatch;
import com.techx.intervue.modules.ai.resources.ToolExecutionResult;
import com.techx.intervue.modules.ai.services.interfaces.CandidateApplicationServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.CompanySearchServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.JobSearchServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.KnowledgeBaseServiceInterface;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class ChatToolTest {

    private ChatToolRegistry registry;
    private JobSearchServiceInterface jobSearchService;
    private CompanySearchServiceInterface companySearchService;
    private CandidateApplicationServiceInterface candidateApplicationService;
    private KnowledgeBaseServiceInterface knowledgeBaseService;

    @BeforeEach
    void setUp() {
        registry = new ChatToolRegistry();
        jobSearchService = mock(JobSearchServiceInterface.class);
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
    @DisplayName("SearchJobsTool formats jobs returned by the job search service")
    void searchJobsShouldFormatServiceResults() {
        when(jobSearchService.search("Java", null, "Ho Chi Minh City", null, 10))
                .thenReturn(
                        List.of(
                                new JobSearchResult(
                                        "201",
                                        "Senior Java Backend Engineer",
                                        "Acme",
                                        "30,000,000 - 55,000,000 VND",
                                        "Ho Chi Minh City",
                                        "SENIOR",
                                        List.of("Java", "Spring Boot"),
                                        "Tin tuyển dụng đang mở tại Acme.",
                                        "/jobs/201")));
        SearchJobsTool tool = new SearchJobsTool(jobSearchService, registry);

        ToolExecutionResult result =
                tool.execute(null, Map.of("keyword", "Java", "location", "Ho Chi Minh City"));

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("<job_search_results>");
        assertThat(result.content()).contains("Senior Java Backend Engineer");
        assertThat(result.content()).contains("/jobs/201");
    }

    @Test
    @DisplayName("SearchJobsTool points to the jobs page when nothing matches")
    void searchJobsShouldPointToJobsPageWhenEmpty() {
        when(jobSearchService.search("Cobol", null, null, null, 10)).thenReturn(List.of());
        SearchJobsTool tool = new SearchJobsTool(jobSearchService, registry);

        ToolExecutionResult result = tool.execute(null, Map.of("keyword", "Cobol"));

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("No IT jobs directly match");
        assertThat(result.content()).contains("(/jobs)");
    }

    @Test
    @DisplayName("SearchJobsTool appends a see-more link when the result cap is reached")
    void searchJobsShouldAppendSeeMoreLinkWhenCapReached() {
        List<JobSearchResult> tenJobs =
                java.util.stream.IntStream.rangeClosed(1, 10)
                        .mapToObj(
                                i ->
                                        new JobSearchResult(
                                                String.valueOf(i),
                                                "Job " + i,
                                                "Acme",
                                                "Lương thỏa thuận",
                                                "Hà Nội",
                                                "MID",
                                                List.of("Java"),
                                                "Tin tuyển dụng đang mở tại Acme.",
                                                "/jobs/" + i))
                        .toList();
        when(jobSearchService.search("Java", null, "Hà Nội", "newest", 10)).thenReturn(tenJobs);
        SearchJobsTool tool = new SearchJobsTool(jobSearchService, registry);

        ToolExecutionResult result =
                tool.execute(
                        null, Map.of("keyword", "Java", "location", "Hà Nội", "sort", "newest"));

        assertThat(result.content())
                .contains("[See more jobs](/jobs?q=Java&city=H%C3%A0+N%E1%BB%99i&sort=NEWEST)");
    }

    @Test
    @DisplayName("SearchJobsTool omits the see-more link when fewer results than the cap")
    void searchJobsShouldOmitSeeMoreLinkWhenBelowCap() {
        when(jobSearchService.search("Java", null, null, null, 10))
                .thenReturn(
                        List.of(
                                new JobSearchResult(
                                        "1",
                                        "Job 1",
                                        "Acme",
                                        "Lương thỏa thuận",
                                        "Hà Nội",
                                        "MID",
                                        List.of("Java"),
                                        "Tin tuyển dụng đang mở tại Acme.",
                                        "/jobs/1")));
        SearchJobsTool tool = new SearchJobsTool(jobSearchService, registry);

        ToolExecutionResult result = tool.execute(null, Map.of("keyword", "Java"));

        assertThat(result.content()).doesNotContain("See more jobs");
    }

    @Test
    @DisplayName("SearchJobsTool searches without a keyword and forwards the sort")
    void searchJobsShouldWorkWithoutKeywordAndForwardSort() {
        when(jobSearchService.search(null, null, null, "NEWEST", 10))
                .thenReturn(
                        List.of(
                                new JobSearchResult(
                                        "450",
                                        "Java Developer",
                                        "Techcombank",
                                        "Lương thỏa thuận",
                                        "Hà Nội",
                                        "MID",
                                        List.of("Java"),
                                        "Tin tuyển dụng đang mở tại Techcombank.",
                                        "/jobs/450")));
        SearchJobsTool tool = new SearchJobsTool(jobSearchService, registry);

        ToolExecutionResult result = tool.execute(null, Map.of("sort", "NEWEST"));

        assertThat(result.isSuccess()).isTrue();
        assertThat(result.content()).contains("Java Developer");
        assertThat(result.content()).contains("/jobs/450");
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
        when(companySearchService.search("TechX", null, null, 10))
                .thenReturn(
                        List.of(
                                new CompanySearchResult(
                                        "1",
                                        "Công ty Cổ phần Công nghệ TechX Global",
                                        "IT - Phần mềm",
                                        "150 - 300 nhân viên",
                                        "Hà Nội",
                                        "https://techx.com",
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
