package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.requests.ValidateVoucherRequest;
import com.techx.intervue.modules.billing.resources.AvailableVoucherResource;
import com.techx.intervue.modules.billing.resources.VoucherPreviewResource;
import com.techx.intervue.modules.billing.services.interfaces.VoucherServiceInterface;
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
@RequestMapping("/api/v1/recruiter/vouchers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterVoucherController extends BaseController {

    private final VoucherServiceInterface voucherService;

    @GetMapping
    public ResponseEntity<ApiResource<List<AvailableVoucherResource>>> listAvailable(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                voucherService.listAvailable(principal.getId()),
                "Available vouchers retrieved successfully!");
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResource<VoucherPreviewResource>> validate(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody ValidateVoucherRequest request) {
        return ok(
                voucherService.validate(request, principal.getId()),
                "Voucher applied successfully!");
    }
}
