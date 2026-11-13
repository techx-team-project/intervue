package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.enums.RefundStatus;
import com.techx.intervue.modules.billing.requests.ReviewRefundRequest;
import com.techx.intervue.modules.billing.resources.RefundRequestResource;
import com.techx.intervue.modules.billing.resources.RefundStatusCountsResource;
import com.techx.intervue.modules.billing.services.interfaces.RefundServiceInterface;
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
@RequestMapping("/api/v1/admin/refunds")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRefundController extends BaseController {

    private final RefundServiceInterface refundService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<RefundRequestResource>>> search(
            @RequestParam(value = "status", required = false) RefundStatus status,
            @RequestParam(value = "orderCode", required = false) String orderCode,
            Pageable pageable) {
        return page(
                refundService.search(status, orderCode, pageable),
                "Refund requests retrieved successfully!");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResource<RefundStatusCountsResource>> summary() {
        return ok(refundService.summaryForAdmin(), "Refund summary retrieved successfully!");
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResource<RefundRequestResource>> approve(
            @PathVariable("id") Long id,
            @Valid @RequestBody ReviewRefundRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                refundService.approve(id, request, actor(principal, httpRequest)),
                "Refund approved. Transfer the money from the bank, the system does not move it.");
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResource<RefundRequestResource>> reject(
            @PathVariable("id") Long id,
            @Valid @RequestBody ReviewRefundRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                refundService.reject(id, request, actor(principal, httpRequest)),
                "Refund request rejected!");
    }
}
