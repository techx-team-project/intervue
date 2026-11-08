package com.techx.intervue.modules.candidate.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.candidate.resources.FollowedCompanyResource;
import com.techx.intervue.modules.candidate.services.interfaces.CompanyFollowServiceInterface;
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
@RequestMapping("/api/v1/candidate/followed-companies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CompanyFollowController extends BaseController {

    private final CompanyFollowServiceInterface followService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<FollowedCompanyResource>>> list(
            Pageable pageable, @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                followService.list(principal.getId(), pageable),
                "Followed companies retrieved successfully!");
    }

    @GetMapping("/ids")
    public ResponseEntity<ApiResource<List<Long>>> listIds(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                followService.listIds(principal.getId()),
                "Followed company ids retrieved successfully!");
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<ApiResource<Void>> follow(
            @PathVariable Long companyId, @AuthenticationPrincipal CustomUserDetails principal) {
        followService.follow(principal.getId(), companyId);
        return ok(null, "Company followed successfully!");
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<ApiResource<Void>> unfollow(
            @PathVariable Long companyId, @AuthenticationPrincipal CustomUserDetails principal) {
        followService.unfollow(principal.getId(), companyId);
        return ok(null, "Company unfollowed successfully!");
    }
}
