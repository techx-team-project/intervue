package com.techx.intervue.modules.candidate.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.candidate.requests.SubmitIdentityVerificationRequest;
import com.techx.intervue.modules.candidate.resources.IdentityVerificationResource;
import com.techx.intervue.modules.candidate.services.interfaces.IdentityVerificationServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/candidate/identity-verification")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateIdentityVerificationController extends BaseController {

    private final IdentityVerificationServiceInterface identityVerificationService;

    @GetMapping
    public ResponseEntity<ApiResource<IdentityVerificationResource>> status(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                identityVerificationService.findStatus(principal.getId()),
                "Identity verification status retrieved successfully!");
    }

    @PostMapping("/manual-review")
    public ResponseEntity<ApiResource<IdentityVerificationResource>> requestManualReview(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                identityVerificationService.requestManualReview(principal.getId()),
                "Manual review requested! An admin will look at your case.");
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResource<IdentityVerificationResource>> submit(
            @Valid @ModelAttribute SubmitIdentityVerificationRequest request,
            @RequestPart("front") MultipartFile front,
            @RequestPart("back") MultipartFile back,
            @RequestPart("selfie") MultipartFile selfie,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                identityVerificationService.submit(principal.getId(), request, front, back, selfie),
                "Identity verification submitted! It is now awaiting review.");
    }
}
