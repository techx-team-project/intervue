package com.techx.intervue.modules.ai.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.ai.requests.UserChatRequest;
import com.techx.intervue.modules.ai.resources.UserChatResponse;
import com.techx.intervue.modules.ai.services.interfaces.AiChatServiceInterface;
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
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiChatController extends BaseController {

    private final AiChatServiceInterface aiChatService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResource<UserChatResponse>> chat(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody UserChatRequest request,
            HttpServletRequest httpRequest) {
        Long userId = principal != null ? principal.getId() : null;
        String ip = resolveClientIp(httpRequest);

        UserChatResponse response = aiChatService.chat(userId, ip, request);
        return ok(response, "Support assistant response generated successfully!");
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
