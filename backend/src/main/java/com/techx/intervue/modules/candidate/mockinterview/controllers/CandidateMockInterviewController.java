package com.techx.intervue.modules.candidate.mockinterview.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.candidate.mockinterview.requests.StartMockInterviewRequest;
import com.techx.intervue.modules.candidate.mockinterview.requests.SubmitMockAnswerRequest;
import com.techx.intervue.modules.candidate.mockinterview.requests.SubmitMockFollowUpRequest;
import com.techx.intervue.modules.candidate.mockinterview.resources.MockInterviewDetailResource;
import com.techx.intervue.modules.candidate.mockinterview.resources.MockInterviewSummaryResource;
import com.techx.intervue.modules.candidate.mockinterview.resources.SubmitAnswerResultResource;
import com.techx.intervue.modules.candidate.mockinterview.services.CandidateMockInterviewServiceInterface;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/v1/candidate/mock-interviews")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateMockInterviewController extends BaseController {

    private final CandidateMockInterviewServiceInterface mockInterviewService;

    @PostMapping
    public ResponseEntity<ApiResource<MockInterviewDetailResource>> startSession(
            @Valid @RequestBody StartMockInterviewRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest servletRequest) {
        String ip = IpHelper.getClientIp(servletRequest);
        return ok(
                mockInterviewService.startSession(principal.getId(), request, ip),
                "Mock interview session started successfully!");
    }

    @GetMapping
    public ResponseEntity<ApiResource<List<MockInterviewSummaryResource>>> listHistory(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                mockInterviewService.listHistory(principal.getId()),
                "Mock interview history retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<MockInterviewDetailResource>> getSessionDetail(
            @PathVariable("id") Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                mockInterviewService.getSessionDetail(principal.getId(), id),
                "Mock interview session detail retrieved successfully!");
    }

    @PostMapping("/{id}/questions/{questionId}/answer")
    public ResponseEntity<ApiResource<SubmitAnswerResultResource>> submitAnswer(
            @PathVariable("id") Long id,
            @PathVariable("questionId") Long questionId,
            @Valid @RequestBody SubmitMockAnswerRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest servletRequest) {
        String ip = IpHelper.getClientIp(servletRequest);
        return ok(
                mockInterviewService.submitAnswer(principal.getId(), id, questionId, request, ip),
                "Answer submitted successfully!");
    }

    @PostMapping("/{id}/questions/{questionId}/follow-up")
    public ResponseEntity<ApiResource<SubmitAnswerResultResource>> submitFollowUp(
            @PathVariable("id") Long id,
            @PathVariable("questionId") Long questionId,
            @Valid @RequestBody SubmitMockFollowUpRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest servletRequest) {
        String ip = IpHelper.getClientIp(servletRequest);
        return ok(
                mockInterviewService.submitFollowUp(principal.getId(), id, questionId, request, ip),
                "Follow-up answer submitted successfully!");
    }
}
