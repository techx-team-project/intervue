package com.techx.intervue.modules.application.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.application.requests.ReapplyRequest;
import com.techx.intervue.modules.application.requests.SaveApplicationRequest;
import com.techx.intervue.modules.application.requests.SearchApplicationsRequest;
import com.techx.intervue.modules.application.resources.ApplicationResource;
import com.techx.intervue.modules.application.resources.ApplicationSummaryResource;
import com.techx.intervue.modules.application.resources.ApplyFormResource;
import com.techx.intervue.modules.application.services.interfaces.ApplicationServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/candidate/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateApplicationController extends BaseController {

    private final ApplicationServiceInterface applicationService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<ApplicationSummaryResource>>> search(
            @Valid SearchApplicationsRequest request,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                applicationService.search(request, pageable, principal.getId()),
                "Applications retrieved successfully!");
    }

    @GetMapping("/applied-job-ids")
    public ResponseEntity<ApiResource<List<Long>>> appliedJobIds(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                applicationService.findAppliedJobIds(principal.getId()),
                "Applied jobs retrieved successfully!");
    }

    @GetMapping("/form")
    public ResponseEntity<ApiResource<ApplyFormResource>> form(
            @RequestParam Long jobId, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                applicationService.findForm(jobId, principal.getId()),
                "Application form retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<ApplicationResource>> detail(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                applicationService.findOne(id, principal.getId()),
                "Application retrieved successfully!");
    }

    @PutMapping("/draft")
    public ResponseEntity<ApiResource<ApplicationResource>> saveDraft(
            @Valid @RequestBody SaveApplicationRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                applicationService.saveDraft(request, actor(principal, httpRequest)),
                "Draft saved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<ApplicationResource>> submit(
            @Valid @RequestBody SaveApplicationRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return created(
                applicationService.submit(request, actor(principal, httpRequest)),
                "Application submitted successfully!");
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<ApiResource<ApplicationResource>> withdraw(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                applicationService.withdraw(id, actor(principal, httpRequest)),
                "Application withdrawn successfully!");
    }

    @PostMapping("/{id}/reapply")
    public ResponseEntity<ApiResource<ApplicationResource>> reapply(
            @PathVariable Long id,
            @Valid @RequestBody ReapplyRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                applicationService.reapply(id, request.resumeId(), actor(principal, httpRequest)),
                "Application submitted again successfully!");
    }

    @GetMapping("/{id}/cv")
    public ResponseEntity<byte[]> downloadCv(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        ResumeContent content = applicationService.downloadCv(id, principal.getId());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(content.contentType()))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(content.fileName())
                                .build()
                                .toString())
                .body(content.bytes());
    }
}
