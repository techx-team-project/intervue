package com.techx.intervue.modules.recruiter.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/me")
@PreAuthorize("hasRole('RECRUITER')")
@RequiredArgsConstructor
public class RecruiterController extends BaseController {

    private final RecruiterServiceInterface recruiterService;

    @GetMapping
    public ResponseEntity<ApiResource<RecruiterResource>> me(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                recruiterService.getMe(principal.getId()),
                "Account information retrieved successfully!");
    }
}
