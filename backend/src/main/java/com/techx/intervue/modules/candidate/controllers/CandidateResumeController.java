package com.techx.intervue.modules.candidate.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.candidate.requests.RenameCandidateResumeRequest;
import com.techx.intervue.modules.candidate.resources.CandidateResumeResource;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.CandidateResumeServiceInterface.ResumeContent;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/candidate/cvs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateResumeController extends BaseController {

    private final CandidateResumeServiceInterface resumeService;

    @GetMapping
    public ResponseEntity<ApiResource<List<CandidateResumeResource>>> list(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(resumeService.findAll(principal.getId()), "CVs retrieved successfully!");
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResource<CandidateResumeResource>> upload(
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(resumeService.upload(file, principal.getId()), "CV uploaded successfully!");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResource<CandidateResumeResource>> rename(
            @PathVariable Long id,
            @Valid @RequestBody RenameCandidateResumeRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                resumeService.rename(id, request.fileName(), principal.getId()),
                "CV renamed successfully!");
    }

    @PostMapping("/{id}/default")
    public ResponseEntity<ApiResource<CandidateResumeResource>> setDefault(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(resumeService.setDefault(id, principal.getId()), "Default CV updated!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResource<Void>> delete(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        resumeService.delete(id, principal.getId());
        return ok(null, "CV deleted successfully!");
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        ResumeContent content = resumeService.download(id, principal.getId());
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
