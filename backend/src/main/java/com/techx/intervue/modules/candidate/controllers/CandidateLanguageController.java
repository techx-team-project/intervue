package com.techx.intervue.modules.candidate.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.candidate.requests.SaveCandidateLanguageRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateLanguageServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/candidate/profile/languages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateLanguageController extends BaseController {

    private final CandidateLanguageServiceInterface languageService;

    @PostMapping
    public ResponseEntity<ApiResource<CandidateProfileResource>> create(
            @Valid @RequestBody SaveCandidateLanguageRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                languageService.create(request, principal.getId()), "Language added successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<CandidateProfileResource>> update(
            @PathVariable Long id,
            @Valid @RequestBody SaveCandidateLanguageRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                languageService.update(id, request, principal.getId()),
                "Language updated successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResource<CandidateProfileResource>> delete(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(languageService.delete(id, principal.getId()), "Language removed successfully!");
    }
}
