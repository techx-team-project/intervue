package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.requests.SaveFreeQuotaSettingsRequest;
import com.techx.intervue.modules.billing.resources.FreeQuotaSettingsResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminFreeQuotaServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/free-quotas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFreeQuotaController extends BaseController {

    private final AdminFreeQuotaServiceInterface freeQuotaService;

    @GetMapping
    public ResponseEntity<ApiResource<FreeQuotaSettingsResource>> get() {
        return ok(freeQuotaService.getSettings(), "Free quota settings retrieved successfully!");
    }

    @PutMapping
    public ResponseEntity<ApiResource<FreeQuotaSettingsResource>> update(
            @Valid @RequestBody SaveFreeQuotaSettingsRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                freeQuotaService.updateSettings(request, actor(principal, httpRequest)),
                "Free quota settings updated successfully!");
    }
}
