package com.techx.intervue.modules.company.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.company.requests.RevokeMembershipRequest;
import com.techx.intervue.modules.company.requests.TransferCompanyOwnerRequest;
import com.techx.intervue.modules.company.resources.CompanyMemberResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyAdminServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/companies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCompanyController extends BaseController {

    private final CompanyAdminServiceInterface companyAdminService;

    @GetMapping("/{companyId}/members")
    public ResponseEntity<ApiResource<List<CompanyMemberResource>>> members(
            @PathVariable Long companyId) {
        return ok(
                companyAdminService.findMembers(companyId),
                "Company members retrieved successfully!");
    }

    @DeleteMapping("/{companyId}/members/{userId}")
    public ResponseEntity<ApiResource<List<CompanyMemberResource>>> revokeMembership(
            @PathVariable Long companyId,
            @PathVariable Long userId,
            @Valid @RequestBody RevokeMembershipRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                companyAdminService.revokeMembership(
                        companyId, userId, request, actor(principal, httpRequest)),
                "Company member removed successfully!");
    }

    @PostMapping("/{companyId}/transfer-owner")
    public ResponseEntity<ApiResource<List<CompanyMemberResource>>> transferOwner(
            @PathVariable Long companyId,
            @Valid @RequestBody TransferCompanyOwnerRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                companyAdminService.transferOwner(
                        companyId, request, actor(principal, httpRequest)),
                "Company ownership transferred successfully!");
    }
}
