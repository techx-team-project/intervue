package com.techx.intervue.modules.ai.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.ai.requests.CvReviewRequest;
import com.techx.intervue.modules.ai.resources.CvReviewQuotaResource;
import com.techx.intervue.modules.ai.resources.CvReviewResult;
import com.techx.intervue.modules.ai.services.interfaces.CvReviewServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/ai/cv-reviews")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CvReviewController extends BaseController {

    private final CvReviewServiceInterface cvReviewService;

    @PostMapping
    public ResponseEntity<ApiResource<CvReviewResult>> reviewCv(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody CvReviewRequest request,
            HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        CvReviewResult result = cvReviewService.reviewCv(principal.getId(), ip, request);
        return ok(result, "CV review completed successfully!");
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResource<CvReviewResult>> reviewUploadedPdf(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "targetPosition", required = false) String targetPosition,
            HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        CvReviewResult result =
                cvReviewService.reviewUploadedPdf(principal.getId(), ip, file, targetPosition);
        return ok(result, "CV review completed successfully!");
    }

    @GetMapping("/quota")
    public ResponseEntity<ApiResource<CvReviewQuotaResource>> getQuota(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(cvReviewService.getQuota(principal.getId()), "Quota retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<CvReviewResult>> getReviewById(
            @AuthenticationPrincipal CustomUserDetails principal, @PathVariable("id") Long id) {
        return ok(
                cvReviewService.getReviewById(principal.getId(), id),
                "CV review retrieved successfully!");
    }

    @GetMapping
    public ResponseEntity<ApiResource<List<CvReviewResult>>> getMyReviews(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                cvReviewService.getCandidateReviews(principal.getId()),
                "Candidate CV reviews retrieved successfully!");
    }
}
