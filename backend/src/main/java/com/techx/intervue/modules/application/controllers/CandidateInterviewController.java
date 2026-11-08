package com.techx.intervue.modules.application.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.application.requests.InterviewReasonRequest;
import com.techx.intervue.modules.application.requests.ProposeInterviewTimeRequest;
import com.techx.intervue.modules.application.resources.InterviewResource;
import com.techx.intervue.modules.application.services.interfaces.CandidateInterviewServiceInterface;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/candidate/interviews")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateInterviewController extends BaseController {

    private static final String CALENDAR_FILE_NAME = "interview.ics";

    private final CandidateInterviewServiceInterface interviewService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<InterviewResource>>> list(
            Pageable pageable, @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                interviewService.list(pageable, principal.getId()),
                "Interviews retrieved successfully!");
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<ApiResource<InterviewResource>> confirm(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                interviewService.confirm(id, principal.getId()),
                "Interview confirmed successfully!");
    }

    @PostMapping("/{id}/decline")
    public ResponseEntity<ApiResource<InterviewResource>> decline(
            @PathVariable Long id,
            @Valid @RequestBody InterviewReasonRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                interviewService.decline(id, request.reason(), principal.getId()),
                "Interview declined successfully!");
    }

    @PostMapping("/{id}/reschedule-request")
    public ResponseEntity<ApiResource<InterviewResource>> requestReschedule(
            @PathVariable Long id,
            @Valid @RequestBody ProposeInterviewTimeRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                interviewService.requestReschedule(
                        id, request.proposedStartsAt(), request.message(), principal.getId()),
                "New interview time suggested successfully!");
    }

    @GetMapping("/{id}/calendar")
    public ResponseEntity<byte[]> calendar(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/calendar;charset=UTF-8"))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(CALENDAR_FILE_NAME)
                                .build()
                                .toString())
                .body(interviewService.calendarFile(id, principal.getId()));
    }
}
