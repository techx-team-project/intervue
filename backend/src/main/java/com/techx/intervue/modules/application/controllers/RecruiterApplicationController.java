package com.techx.intervue.modules.application.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.application.requests.AddApplicationNoteRequest;
import com.techx.intervue.modules.application.requests.ChangeApplicationStatusRequest;
import com.techx.intervue.modules.application.requests.SearchRecruiterApplicationsRequest;
import com.techx.intervue.modules.application.resources.ApplicationStatusCountsResource;
import com.techx.intervue.modules.application.resources.RecruiterApplicationResource;
import com.techx.intervue.modules.application.resources.RecruiterApplicationSummaryResource;
import com.techx.intervue.modules.application.services.interfaces.RecruiterApplicationServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/applications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterApplicationController extends BaseController {

    private final RecruiterApplicationServiceInterface applicationService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<RecruiterApplicationSummaryResource>>> search(
            @Valid SearchRecruiterApplicationsRequest request,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                applicationService.search(request, pageable, principal.getId()),
                "Applications retrieved successfully!");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResource<ApplicationStatusCountsResource>> summary(
            @RequestParam(required = false) Long jobId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                applicationService.countByStatus(jobId, principal.getId()),
                "Application summary retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<RecruiterApplicationResource>> open(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                applicationService.open(id, principal.getId()),
                "Application retrieved successfully!");
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResource<RecruiterApplicationResource>> changeStatus(
            @PathVariable Long id,
            @Valid @RequestBody ChangeApplicationStatusRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                applicationService.changeStatus(
                        id, request.status(), request.note(), principal.getId()),
                "Application status updated successfully!");
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<ApiResource<RecruiterApplicationResource>> addNote(
            @PathVariable Long id,
            @Valid @RequestBody AddApplicationNoteRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                applicationService.addNote(id, request.content(), principal.getId()),
                "Note added successfully!");
    }

    @DeleteMapping("/{id}/notes/{noteId}")
    public ResponseEntity<ApiResource<RecruiterApplicationResource>> deleteNote(
            @PathVariable Long id,
            @PathVariable Long noteId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                applicationService.deleteNote(id, noteId, principal.getId()),
                "Note deleted successfully!");
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
