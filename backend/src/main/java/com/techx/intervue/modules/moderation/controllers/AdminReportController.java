package com.techx.intervue.modules.moderation.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.moderation.enums.ReportStatus;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.requests.AdminDismissReportRequest;
import com.techx.intervue.modules.moderation.requests.AdminResolveReportRequest;
import com.techx.intervue.modules.moderation.resources.AdminReportDetailResource;
import com.techx.intervue.modules.moderation.resources.AdminReportSummaryResource;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReportController extends BaseController {

    private final ReportServiceInterface reportService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminReportSummaryResource>>> search(
            @RequestParam(required = false) ReportTargetType targetType,
            @RequestParam(required = false) ReportStatus status,
            Pageable pageable) {
        return page(
                reportService.search(targetType, status, pageable),
                "Reports retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<AdminReportDetailResource>> detail(@PathVariable Long id) {
        return ok(reportService.get(id), "Report retrieved successfully!");
    }

    @PostMapping("/{id}/dismiss")
    public ResponseEntity<ApiResource<Void>> dismiss(
            @PathVariable Long id,
            @Valid @RequestBody(required = false) AdminDismissReportRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        AdminDismissReportRequest payload =
                request == null ? new AdminDismissReportRequest(null) : request;
        reportService.dismiss(id, payload.note(), actor(principal, httpRequest));
        return ok(null, "Report dismissed successfully!");
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<ApiResource<Void>> resolve(
            @PathVariable Long id,
            @Valid @RequestBody AdminResolveReportRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        reportService.resolve(
                id,
                request.action(),
                request.note(),
                request.lockActorType(),
                request.lockActorId(),
                actor(principal, httpRequest));
        return ok(null, "Report resolved successfully!");
    }
}
