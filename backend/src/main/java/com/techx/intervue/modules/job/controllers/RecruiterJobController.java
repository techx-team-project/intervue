package com.techx.intervue.modules.job.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.job.requests.RenewJobRequest;
import com.techx.intervue.modules.job.requests.SaveJobRequest;
import com.techx.intervue.modules.job.requests.SearchRecruiterJobsRequest;
import com.techx.intervue.modules.job.requests.SimilarJobsRequest;
import com.techx.intervue.modules.job.resources.JobHistoryResource;
import com.techx.intervue.modules.job.resources.JobQuotaResource;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.resources.JobStatsResource;
import com.techx.intervue.modules.job.resources.JobStatusCountsResource;
import com.techx.intervue.modules.job.resources.JobSummaryResource;
import com.techx.intervue.modules.job.resources.SimilarJobResource;
import com.techx.intervue.modules.job.services.interfaces.JobHistoryServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.JobServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.JobStatsServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterJobController extends BaseController {

    private final JobServiceInterface jobService;
    private final JobHistoryServiceInterface jobHistoryService;
    private final JobStatsServiceInterface jobStatsService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<JobSummaryResource>>> search(
            @Valid SearchRecruiterJobsRequest request,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                jobService.search(request, pageable, principal.getId()),
                "Jobs retrieved successfully!");
    }

    @GetMapping("/similar")
    public ResponseEntity<ApiResource<List<SimilarJobResource>>> similar(
            @Valid SimilarJobsRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                jobService.findSimilar(request, principal.getId()),
                "Similar jobs retrieved successfully!");
    }

    @GetMapping("/quota")
    public ResponseEntity<ApiResource<JobQuotaResource>> quota(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(jobService.quota(principal.getId()), "Job quota retrieved successfully!");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResource<JobStatusCountsResource>> summary(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                jobService.countByStatus(principal.getId()), "Job summary retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<JobResource>> detail(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(jobService.findOne(id, principal.getId()), "Job retrieved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<JobResource>> create(
            @Valid @RequestBody SaveJobRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(jobService.create(request, principal.getId()), "Job saved as draft!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<JobResource>> update(
            @PathVariable Long id,
            @Valid @RequestBody SaveJobRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(jobService.update(id, request, principal.getId()), "Job updated successfully!");
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<ApiResource<JobResource>> publish(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(jobService.publish(id, principal.getId()), "Job published successfully!");
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<ApiResource<JobResource>> pause(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(jobService.pause(id, principal.getId()), "Job paused successfully!");
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<ApiResource<JobResource>> resume(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(jobService.resume(id, principal.getId()), "Job resumed successfully!");
    }

    @PostMapping("/{id}/close")
    public ResponseEntity<ApiResource<JobResource>> close(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(jobService.close(id, principal.getId()), "Job closed successfully!");
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<ApiResource<JobResource>> renew(
            @PathVariable Long id,
            @Valid @RequestBody RenewJobRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(jobService.renew(id, request, principal.getId()), "Job renewed successfully!");
    }

    @PostMapping("/{id}/extend")
    public ResponseEntity<ApiResource<JobResource>> extend(
            @PathVariable Long id,
            @Valid @RequestBody RenewJobRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                jobService.extend(id, request, principal.getId()),
                "Job deadline extended successfully!");
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResource<JobStatsResource>> stats(
            @PathVariable Long id,
            @RequestParam(defaultValue = "30") int days,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                jobStatsService.stats(id, days, principal.getId()),
                "Job stats retrieved successfully!");
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResource<PageResource<JobHistoryResource>>> history(
            @PathVariable Long id,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                jobHistoryService.history(id, principal.getId(), pageable),
                "Job history retrieved successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResource<Void>> delete(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        jobService.delete(id, principal.getId());
        return ok(null, "Job deleted successfully!");
    }
}
