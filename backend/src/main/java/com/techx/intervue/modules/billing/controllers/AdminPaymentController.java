package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.enums.PaymentTransactionStatus;
import com.techx.intervue.modules.billing.requests.MatchPaymentTransactionRequest;
import com.techx.intervue.modules.billing.requests.SaveBillingSettingsRequest;
import com.techx.intervue.modules.billing.resources.BillingSettingsResource;
import com.techx.intervue.modules.billing.resources.PaymentSyncResultResource;
import com.techx.intervue.modules.billing.resources.PaymentTransactionResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminPaymentServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.PaymentSyncServiceInterface;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPaymentController extends BaseController {

    private final AdminPaymentServiceInterface adminPaymentService;
    private final PaymentSyncServiceInterface paymentSyncService;

    @GetMapping("/settings")
    public ResponseEntity<ApiResource<BillingSettingsResource>> settings() {
        return ok(adminPaymentService.getSettings(), "Billing settings retrieved successfully!");
    }

    @PutMapping("/settings")
    public ResponseEntity<ApiResource<BillingSettingsResource>> updateSettings(
            @Valid @RequestBody SaveBillingSettingsRequest body,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return ok(
                adminPaymentService.updateSettings(body, actor(principal, request)),
                "Billing settings updated successfully!");
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResource<PageResource<PaymentTransactionResource>>> transactions(
            @RequestParam(required = false) PaymentTransactionStatus status, Pageable pageable) {
        return page(
                adminPaymentService.searchTransactions(status, pageable),
                "Bank transactions retrieved successfully!");
    }

    @PostMapping("/transactions/{id}/match")
    public ResponseEntity<ApiResource<PaymentTransactionResource>> match(
            @PathVariable Long id,
            @Valid @RequestBody MatchPaymentTransactionRequest body,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return ok(
                adminPaymentService.matchTransaction(id, body, actor(principal, request)),
                "Transaction matched successfully!");
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResource<PaymentSyncResultResource>> sync() {
        return ok(paymentSyncService.sync(), "Payment reconciliation finished!");
    }
}
