package com.techx.intervue.common.audit.controllers;

import com.techx.intervue.common.audit.requests.SearchAuditLogRequest;
import com.techx.intervue.common.audit.resources.AdminAuditLogResource;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({
    "/api/v1/admin/audit-log",
    "/api/v1/admin/audit-logs",
    "/api/v1/admin/users/audit-log"
})
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAuditLogController extends BaseController {

    private final AuditLogServiceInterface auditLogService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminAuditLogResource>>> list(
            @Valid SearchAuditLogRequest request, Pageable pageable) {
        return page(
                auditLogService.search(request, pageable), "Audit logs retrieved successfully!");
    }
}
