package com.techx.intervue.modules.ai.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.ai.requests.CoverLetterGenerateRequest;
import com.techx.intervue.modules.ai.resources.CoverLetterGenerateResult;
import com.techx.intervue.modules.ai.services.interfaces.CoverLetterServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai/cover-letter")
@RequiredArgsConstructor
public class CoverLetterController extends BaseController {

    private final CoverLetterServiceInterface coverLetterService;

    @PostMapping
    public ResponseEntity<ApiResource<CoverLetterGenerateResult>> generateCoverLetter(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody CoverLetterGenerateRequest request,
            HttpServletRequest servletRequest) {
        Long userId = principal != null ? principal.getId() : null;
        String ip = servletRequest.getRemoteAddr();
        CoverLetterGenerateResult result =
                coverLetterService.generateCoverLetter(userId, ip, request);
        return ok(result, "Cover letter generated successfully!");
    }
}
