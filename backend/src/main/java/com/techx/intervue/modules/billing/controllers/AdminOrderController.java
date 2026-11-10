package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.enums.OrderStatus;
import com.techx.intervue.modules.billing.requests.SearchAdminOrdersRequest;
import com.techx.intervue.modules.billing.resources.AdminOrderResource;
import com.techx.intervue.modules.billing.resources.RevenueReportResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminOrderServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController extends BaseController {

    private final AdminOrderServiceInterface adminOrderService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminOrderResource>>> search(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "status", required = false) OrderStatus status,
            @RequestParam(value = "companyId", required = false) Long companyId,
            @RequestParam(value = "from", required = false)
                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                    Instant from,
            @RequestParam(value = "to", required = false)
                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                    Instant to,
            @RequestParam(value = "needsManualRefund", required = false) Boolean needsManualRefund,
            Pageable pageable) {
        return page(
                adminOrderService.search(
                        new SearchAdminOrdersRequest(
                                code, status, companyId, from, to, needsManualRefund),
                        pageable),
                "Orders retrieved successfully!");
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResource<RevenueReportResource>> revenue() {
        return ok(adminOrderService.revenue(), "Revenue report retrieved successfully!");
    }

    @GetMapping("/{code}")
    public ResponseEntity<ApiResource<AdminOrderResource>> detail(
            @PathVariable("code") String code) {
        return ok(adminOrderService.findByCode(code), "Order retrieved successfully!");
    }

    @PostMapping("/{code}/resolve-manual-refund")
    public ResponseEntity<ApiResource<AdminOrderResource>> resolveManualRefund(
            @PathVariable("code") String code,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adminOrderService.resolveManualRefund(code, actor(principal, httpRequest)),
                "Order marked as manually refunded!");
    }
}
