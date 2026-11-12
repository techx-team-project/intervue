package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.requests.AdjustCompanyCreditsRequest;
import com.techx.intervue.modules.billing.resources.AdminCompanyCreditDetailResource;
import com.techx.intervue.modules.billing.resources.AdminCompanyCreditSummaryResource;
import com.techx.intervue.modules.billing.resources.CreditLedgerEntryResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminCompanyCreditServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
@RequestMapping("/api/v1/admin/credits/companies")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCompanyCreditController extends BaseController {

    private final AdminCompanyCreditServiceInterface adminCompanyCreditService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminCompanyCreditSummaryResource>>> list(
            @RequestParam(required = false) String q,
            @PageableDefault(size = 20) Pageable pageable) {
        return page(
                adminCompanyCreditService.listCompanies(q, pageable),
                "Company credit wallets retrieved successfully!");
    }

    @GetMapping("/{companyId}")
    public ResponseEntity<ApiResource<AdminCompanyCreditDetailResource>> detail(
            @PathVariable("companyId") Long companyId) {
        return ok(
                adminCompanyCreditService.getCompanyWallet(companyId),
                "Company credit wallet retrieved successfully!");
    }

    @GetMapping("/{companyId}/ledger")
    public ResponseEntity<ApiResource<PageResource<CreditLedgerEntryResource>>> ledger(
            @PathVariable("companyId") Long companyId,
            @PageableDefault(size = 20) Pageable pageable) {
        return page(
                adminCompanyCreditService.companyLedger(companyId, pageable),
                "Company credit ledger retrieved successfully!");
    }

    @PostMapping("/{companyId}/adjust")
    public ResponseEntity<ApiResource<AdminCompanyCreditDetailResource>> adjust(
            @PathVariable("companyId") Long companyId,
            @Valid @RequestBody AdjustCompanyCreditsRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adminCompanyCreditService.adjustCredits(
                        companyId, request, actor(principal, httpRequest)),
                "Company credits adjusted successfully!");
    }
}
