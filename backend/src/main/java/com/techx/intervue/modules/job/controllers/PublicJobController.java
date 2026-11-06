package com.techx.intervue.modules.job.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.resources.PublicJobResource;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import com.techx.intervue.modules.job.services.interfaces.PublicJobServiceInterface;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class PublicJobController extends BaseController {

    private final PublicJobServiceInterface publicJobService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<PublicJobSummaryResource>>> search(
            @Valid SearchJobsRequest request, Pageable pageable) {
        return page(publicJobService.search(request, pageable), "Jobs retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<PublicJobResource>> detail(@PathVariable Long id) {
        return ok(publicJobService.findOne(id), "Job retrieved successfully!");
    }
}
