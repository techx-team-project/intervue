package com.techx.intervue.modules.ai.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.ai.requests.ResumeMatchRequest;
import com.techx.intervue.modules.ai.resources.ResumeMatchQuotaResource;
import com.techx.intervue.modules.ai.resources.ResumeMatchResult;
import com.techx.intervue.modules.ai.services.interfaces.ResumeMatchQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.ResumeMatchServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
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

@PreAuthorize("hasRole('RECRUITER')")
@RestController
@RequestMapping("/api/v1/recruiter/ai")
@RequiredArgsConstructor
public class ResumeMatchController extends BaseController {

    private final ResumeMatchServiceInterface resumeMatchService;
    private final ResumeMatchQuotaServiceInterface resumeMatchQuotaService;

    @GetMapping("/resume-match/quota")
    public ResponseEntity<ApiResource<ResumeMatchQuotaResource>> quota(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                resumeMatchQuotaService.getQuota(principal.getId()),
                "Resume match quota retrieved successfully!");
    }

    @PostMapping("/resume-match")
    public ResponseEntity<ApiResource<ResumeMatchResult>> analyze(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody ResumeMatchRequest request,
            HttpServletRequest httpRequest) {
        Long userId = principal.getId();
        String ip = resolveClientIp(httpRequest);

        return ok(
                resumeMatchService.analyze(userId, ip, request),
                "Resume matched with job requirements successfully!");
    }

    @PostMapping("/applications/{id}/analyze")
    public ResponseEntity<ApiResource<ResumeMatchResult>> analyzeApplication(
            @PathVariable("id") String id,
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody ResumeMatchRequest request,
            HttpServletRequest httpRequest) {
        Long userId = principal.getId();
        String ip = resolveClientIp(httpRequest);

        ResumeMatchRequest effectiveRequest =
                (request.applicationId() == null || !request.applicationId().equals(id))
                        ? new ResumeMatchRequest(
                                id,
                                request.jobTitle(),
                                request.jobRequirements(),
                                request.jobDescription(),
                                request.candidateData(),
                                request.cvText())
                        : request;

        return ok(
                resumeMatchService.analyze(userId, ip, effectiveRequest),
                "Application analyzed with AI successfully!");
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
