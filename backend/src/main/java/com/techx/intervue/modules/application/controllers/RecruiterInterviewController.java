package com.techx.intervue.modules.application.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.application.enums.InterviewStatus;
import com.techx.intervue.modules.application.requests.InterviewReasonRequest;
import com.techx.intervue.modules.application.requests.ScheduleInterviewRequest;
import com.techx.intervue.modules.application.resources.InterviewResource;
import com.techx.intervue.modules.application.services.interfaces.RecruiterInterviewServiceInterface;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/interviews")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterInterviewController extends BaseController {

    private final RecruiterInterviewServiceInterface interviewService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<InterviewResource>>> search(
            @RequestParam(required = false) InterviewStatus status,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                interviewService.search(status, pageable, principal.getId()),
                "Interviews retrieved successfully!");
    }

    @GetMapping("/by-application/{applicationId}")
    public ResponseEntity<ApiResource<List<InterviewResource>>> listForApplication(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                interviewService.listForApplication(applicationId, principal.getId()),
                "Interviews retrieved successfully!");
    }

    @PostMapping("/by-application/{applicationId}")
    public ResponseEntity<ApiResource<InterviewResource>> schedule(
            @PathVariable Long applicationId,
            @Valid @RequestBody ScheduleInterviewRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                interviewService.schedule(applicationId, request, principal.getId()),
                "Interview invitation sent successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<InterviewResource>> update(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleInterviewRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                interviewService.update(id, request, principal.getId()),
                "Interview updated successfully!");
    }

    @PostMapping("/{id}/accept-proposal")
    public ResponseEntity<ApiResource<InterviewResource>> acceptProposal(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                interviewService.acceptProposal(id, principal.getId()),
                "Proposed time accepted successfully!");
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResource<InterviewResource>> cancel(
            @PathVariable Long id,
            @Valid @RequestBody InterviewReasonRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                interviewService.cancel(id, request.reason(), principal.getId()),
                "Interview cancelled successfully!");
    }
}
