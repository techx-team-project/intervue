package com.techx.intervue.modules.company.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.company.services.interfaces.LocalDemoCompanyServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Profile("local")
@RequestMapping("/api/v1/recruiter/company/demo-setup")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class LocalDemoCompanyController extends BaseController {

    private final LocalDemoCompanyServiceInterface demoCompanyService;

    @PostMapping
    public ResponseEntity<ApiResource<Void>> prepare(
            @AuthenticationPrincipal CustomUserDetails principal, HttpServletRequest request) {
        demoCompanyService.prepare(actor(principal, request));
        return ok(null, "Demo company setup is ready!");
    }
}
