package com.techx.intervue.modules.job.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.job.requests.ReportJobRequest;
import com.techx.intervue.modules.job.services.interfaces.JobReportServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/candidate/jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateJobReportController extends BaseController {

    private final JobReportServiceInterface jobReportService;

    @PostMapping("/{id}/report")
    public ResponseEntity<ApiResource<Void>> report(
            @PathVariable Long id,
            @Valid @RequestBody ReportJobRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        jobReportService.report(id, principal.getId(), request);
        return created(null, "Job reported successfully!");
    }
}
