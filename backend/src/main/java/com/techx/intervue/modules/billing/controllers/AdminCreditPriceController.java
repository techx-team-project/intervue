package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.requests.SaveCreditPriceRequest;
import com.techx.intervue.modules.billing.resources.CreditPriceResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminCreditPriceServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/credit-prices")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCreditPriceController extends BaseController {

    private final AdminCreditPriceServiceInterface creditPriceService;

    @GetMapping
    public ResponseEntity<ApiResource<List<CreditPriceResource>>> list() {
        return ok(creditPriceService.list(), "Credit prices retrieved successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<CreditPriceResource>> update(
            @PathVariable("id") Long id,
            @Valid @RequestBody SaveCreditPriceRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                creditPriceService.update(id, request, actor(principal, httpRequest)),
                "Credit price updated successfully!");
    }
}
