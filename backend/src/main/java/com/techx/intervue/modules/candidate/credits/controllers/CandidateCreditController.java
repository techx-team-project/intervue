package com.techx.intervue.modules.candidate.credits.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.candidate.credits.requests.TopupCreditsRequest;
import com.techx.intervue.modules.candidate.credits.resources.CandidateCreditSummaryResource;
import com.techx.intervue.modules.candidate.credits.services.CandidateCreditServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/candidate/credits")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateCreditController extends BaseController {

    private final CandidateCreditServiceInterface creditService;

    @GetMapping
    public ResponseEntity<ApiResource<CandidateCreditSummaryResource>> getCreditSummary(
            @AuthenticationPrincipal CustomUserDetails principal) {
        CandidateCreditSummaryResource summary = creditService.getSummary(principal.getId());
        return ok(summary, "Candidate credit summary retrieved successfully!");
    }

    @PostMapping("/topup")
    public ResponseEntity<ApiResource<CandidateCreditSummaryResource>> topupCredits(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody TopupCreditsRequest request) {
        CandidateCreditSummaryResource summary =
                creditService.topup(principal.getId(), request.amount());
        return ok(summary, "Credits topped up successfully!");
    }
}
