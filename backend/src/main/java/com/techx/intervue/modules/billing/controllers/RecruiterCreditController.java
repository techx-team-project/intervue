package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.requests.ConvertCreditsRequest;
import com.techx.intervue.modules.billing.resources.CreditLedgerEntryResource;
import com.techx.intervue.modules.billing.resources.CreditWalletResource;
import com.techx.intervue.modules.billing.services.interfaces.CreditServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/credits")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterCreditController extends BaseController {

    private final CreditServiceInterface creditService;

    @GetMapping
    public ResponseEntity<ApiResource<CreditWalletResource>> wallet(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                creditService.getWallet(principal.getId()),
                "Credit wallet retrieved successfully!");
    }

    @GetMapping("/ledger")
    public ResponseEntity<ApiResource<List<CreditLedgerEntryResource>>> ledger(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(creditService.ledger(principal.getId()), "Credit ledger retrieved successfully!");
    }

    @PostMapping("/convert")
    public ResponseEntity<ApiResource<CreditWalletResource>> convert(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody ConvertCreditsRequest request) {
        return ok(
                creditService.convert(principal.getId(), request),
                "Credits exchanged for the service successfully!");
    }
}
