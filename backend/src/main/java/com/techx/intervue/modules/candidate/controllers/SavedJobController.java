package com.techx.intervue.modules.candidate.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.candidate.resources.SavedJobResource;
import com.techx.intervue.modules.candidate.services.interfaces.SavedJobServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/candidate/saved-jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class SavedJobController extends BaseController {

    private final SavedJobServiceInterface savedJobService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<SavedJobResource>>> list(
            Pageable pageable, @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                savedJobService.list(principal.getId(), pageable),
                "Saved jobs retrieved successfully!");
    }

    @GetMapping("/ids")
    public ResponseEntity<ApiResource<List<Long>>> listIds(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                savedJobService.listIds(principal.getId()),
                "Saved job ids retrieved successfully!");
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<ApiResource<Void>> save(
            @PathVariable Long jobId, @AuthenticationPrincipal CustomUserDetails principal) {
        savedJobService.save(principal.getId(), jobId);
        return ok(null, "Job saved successfully!");
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResource<Void>> remove(
            @PathVariable Long jobId, @AuthenticationPrincipal CustomUserDetails principal) {
        savedJobService.remove(principal.getId(), jobId);
        return ok(null, "Job removed from saved jobs!");
    }
}
