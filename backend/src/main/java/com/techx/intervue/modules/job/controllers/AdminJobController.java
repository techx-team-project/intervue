package com.techx.intervue.modules.job.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.job.requests.AdminSearchJobsRequest;
import com.techx.intervue.modules.job.requests.HideJobRequest;
import com.techx.intervue.modules.job.requests.RejectJobRequest;
import com.techx.intervue.modules.job.resources.AdminJobInsightsResource;
import com.techx.intervue.modules.job.resources.AdminJobSummaryResource;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.resources.JobStatusCountsResource;
import com.techx.intervue.modules.job.services.interfaces.AdminJobInsightsServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.AdminJobServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.JobReviewServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminJobController extends BaseController {

    private final AdminJobServiceInterface adminJobService;
    private final JobReviewServiceInterface jobReviewService;
    private final AdminJobInsightsServiceInterface insightsService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminJobSummaryResource>>> search(
            @Valid AdminSearchJobsRequest request, Pageable pageable) {
        return page(adminJobService.search(request, pageable), "Jobs retrieved successfully!");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResource<JobStatusCountsResource>> summary() {
        return ok(adminJobService.countByStatus(), "Job summary retrieved successfully!");
    }

    @GetMapping("/insights")
    public ResponseEntity<ApiResource<AdminJobInsightsResource>> insights(
            @RequestParam(defaultValue = "30") int days) {
        return ok(insightsService.insights(days), "Job insights retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<JobResource>> detail(@PathVariable Long id) {
        return ok(adminJobService.findOne(id), "Job retrieved successfully!");
    }

    @PostMapping("/{id}/hide")
    public ResponseEntity<ApiResource<JobResource>> hide(
            @PathVariable Long id,
            @Valid @RequestBody HideJobRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adminJobService.hide(id, request.reason(), actor(principal, httpRequest)),
                "Job hidden successfully!");
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResource<JobResource>> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                jobReviewService.approve(id, actor(principal, httpRequest)),
                "Job approved successfully!");
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResource<JobResource>> reject(
            @PathVariable Long id,
            @Valid @RequestBody RejectJobRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                jobReviewService.reject(id, request.reason(), actor(principal, httpRequest)),
                "Job rejected successfully!");
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<ApiResource<JobResource>> restore(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adminJobService.restore(id, actor(principal, httpRequest)),
                "Job restored successfully!");
    }
}
