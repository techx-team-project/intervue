package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.requests.SaveVoucherRequest;
import com.techx.intervue.modules.billing.resources.AdminVoucherResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminVoucherServiceInterface;
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
@RequestMapping("/api/v1/admin/vouchers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminVoucherController extends BaseController {

    private final AdminVoucherServiceInterface adminVoucherService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminVoucherResource>>> search(
            @RequestParam(value = "keyword", required = false) String keyword, Pageable pageable) {
        return page(
                adminVoucherService.search(keyword, pageable), "Vouchers retrieved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<AdminVoucherResource>> create(
            @Valid @RequestBody SaveVoucherRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return created(
                adminVoucherService.create(request, actor(principal, httpRequest)),
                "Voucher created successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<AdminVoucherResource>> update(
            @PathVariable("id") Long id,
            @Valid @RequestBody SaveVoucherRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adminVoucherService.update(id, request, actor(principal, httpRequest)),
                "Voucher updated successfully!");
    }
}
