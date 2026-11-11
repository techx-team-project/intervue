package com.techx.intervue.modules.ai.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.ai.requests.JdGenerateRequest;
import com.techx.intervue.modules.ai.resources.JdGenerateQuotaResource;
import com.techx.intervue.modules.ai.resources.JdGenerateResult;
import com.techx.intervue.modules.ai.services.interfaces.JdGenerateQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.JdGenerateServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
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

@PreAuthorize("hasRole('RECRUITER')")
@RestController
@RequestMapping("/api/v1/recruiter/ai")
@RequiredArgsConstructor
public class JdGenerateController extends BaseController {

    private final JdGenerateServiceInterface jdGenerateService;
    private final JdGenerateQuotaServiceInterface jdGenerateQuotaService;

    @GetMapping("/jd-generate/quota")
    public ResponseEntity<ApiResource<JdGenerateQuotaResource>> quota(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                jdGenerateQuotaService.getQuota(principal.getId()),
                "JD generation quota retrieved successfully!");
    }

    @PostMapping("/jd-generate")
    public ResponseEntity<ApiResource<JdGenerateResult>> generate(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody JdGenerateRequest request,
            HttpServletRequest httpRequest) {
        return ok(
                jdGenerateService.generate(
                        principal.getId(), ClientIpResolver.resolve(httpRequest), request),
                "Job description generated successfully!");
    }
}
