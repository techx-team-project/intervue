package com.techx.intervue.modules.candidate.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.candidate.requests.SaveCandidateProfileRequest;
import com.techx.intervue.modules.candidate.resources.CandidateProfileResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateProfileServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/candidate/profile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateProfileController extends BaseController {

    private final CandidateProfileServiceInterface candidateProfileService;

    @GetMapping
    public ResponseEntity<ApiResource<CandidateProfileResource>> myProfile(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                candidateProfileService.getMine(principal.getId()),
                "Candidate profile retrieved successfully!");
    }

    @PutMapping
    public ResponseEntity<ApiResource<CandidateProfileResource>> update(
            @Valid @RequestBody SaveCandidateProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                candidateProfileService.updateMine(principal.getId(), request),
                "Candidate profile updated successfully!");
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResource<CandidateProfileResource>> replaceAvatar(
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                candidateProfileService.replaceAvatar(file, principal.getId()),
                "Candidate avatar uploaded successfully!");
    }

    @DeleteMapping("/avatar")
    public ResponseEntity<ApiResource<CandidateProfileResource>> removeAvatar(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                candidateProfileService.removeAvatar(principal.getId()),
                "Candidate avatar removed successfully!");
    }

    @PostMapping(value = "/cover", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResource<CandidateProfileResource>> replaceCover(
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                candidateProfileService.replaceCover(file, principal.getId()),
                "Candidate cover uploaded successfully!");
    }

    @DeleteMapping("/cover")
    public ResponseEntity<ApiResource<CandidateProfileResource>> removeCover(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                candidateProfileService.removeCover(principal.getId()),
                "Candidate cover removed successfully!");
    }
}
