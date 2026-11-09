package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.requests.CheckoutRequest;
import com.techx.intervue.modules.billing.resources.OrderResource;
import com.techx.intervue.modules.billing.resources.OrderSummaryResource;
import com.techx.intervue.modules.billing.services.interfaces.OrderServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterOrderController extends BaseController {

    private final OrderServiceInterface orderService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<OrderSummaryResource>>> search(
            Pageable pageable, @AuthenticationPrincipal CustomUserDetails principal) {
        return page(
                orderService.search(pageable, principal.getId()), "Orders retrieved successfully!");
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResource<OrderResource>> detail(
            @PathVariable String code, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                orderService.findByCode(code, principal.getId()), "Order retrieved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<OrderResource>> checkout(
            @Valid @RequestBody CheckoutRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                orderService.checkout(request, principal.getId()), "Order created successfully!");
    }

    @PostMapping("/{code}/cancel")
    public ResponseEntity<ApiResource<OrderResource>> cancel(
            @PathVariable String code, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(orderService.cancel(code, principal.getId()), "Order cancelled successfully!");
    }
}
