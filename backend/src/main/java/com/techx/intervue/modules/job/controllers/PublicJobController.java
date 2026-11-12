package com.techx.intervue.modules.job.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.job.requests.NearbyJobsRequest;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.resources.JobRecommendationResponse;
import com.techx.intervue.modules.job.resources.NearbyJobResource;
import com.techx.intervue.modules.job.resources.PublicJobResource;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.services.interfaces.JobRecommendationServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.JobViewServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class PublicJobController extends BaseController {

    private final PublicJobServiceInterface publicJobService;
    private final JobRecommendationServiceInterface recommendationService;
    private final JobViewServiceInterface jobViewService;

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResource<JobRecommendationResponse>> recommendations(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(defaultValue = "6") int limit) {
        Long userId = principal != null ? principal.getId() : null;
        return ok(
                recommendationService.getRecommendations(userId, limit),
                "Job recommendations retrieved successfully!");
    }

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<PublicJobSummaryResource>>> search(
            @Valid SearchJobsRequest request, Pageable pageable) {
        return page(publicJobService.search(request, pageable), "Jobs retrieved successfully!");
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResource<List<NearbyJobResource>>> nearby(
            @Valid NearbyJobsRequest request) {
        return ok(publicJobService.findNearby(request), "Nearby jobs retrieved successfully!");
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<ApiResource<Void>> view(
            @PathVariable Long id, HttpServletRequest request) {
        jobViewService.record(id, IpHelper.getClientIp(request));
        return ok(null, "View recorded!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<PublicJobResource>> detail(@PathVariable Long id) {
        return ok(publicJobService.findOne(id), "Job retrieved successfully!");
    }
}
