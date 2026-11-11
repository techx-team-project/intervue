package com.techx.intervue.modules.ads.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.ads.enums.AdCreativeStatus;
import com.techx.intervue.modules.ads.requests.CreateAdSlotRequest;
import com.techx.intervue.modules.ads.requests.ReviewAdCreativeRequest;
import com.techx.intervue.modules.ads.requests.SaveAdSlotRequest;
import com.techx.intervue.modules.ads.resources.AdSlotResource;
import com.techx.intervue.modules.ads.resources.AdminAdCreativeResource;
import com.techx.intervue.modules.ads.services.interfaces.AdCreativeServiceInterface;
import com.techx.intervue.modules.ads.services.interfaces.AdminAdSlotServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/api/v1/admin/ads")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAdController extends BaseController {

    private final AdminAdSlotServiceInterface adminAdSlotService;
    private final AdCreativeServiceInterface adCreativeService;

    @GetMapping("/slots")
    public ResponseEntity<ApiResource<List<AdSlotResource>>> slots() {
        return ok(adminAdSlotService.list(), "Ad slots retrieved successfully!");
    }

    @PostMapping("/slots")
    public ResponseEntity<ApiResource<AdSlotResource>> createSlot(
            @Valid @RequestBody CreateAdSlotRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return created(
                adminAdSlotService.create(request, actor(principal, httpRequest)),
                "Ad slot created successfully!");
    }

    @PutMapping("/slots/{id}")
    public ResponseEntity<ApiResource<AdSlotResource>> updateSlot(
            @PathVariable("id") Long id,
            @Valid @RequestBody SaveAdSlotRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adminAdSlotService.update(id, request, actor(principal, httpRequest)),
                "Ad slot updated successfully!");
    }

    @GetMapping("/creatives")
    public ResponseEntity<ApiResource<PageResource<AdminAdCreativeResource>>> creatives(
            @RequestParam(value = "status", required = false) AdCreativeStatus status,
            Pageable pageable) {
        return page(adCreativeService.search(status, pageable), "Artwork retrieved successfully!");
    }

    @PostMapping("/creatives/{id}/approve")
    public ResponseEntity<ApiResource<AdminAdCreativeResource>> approve(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adCreativeService.approve(id, actor(principal, httpRequest)),
                "Artwork approved successfully!");
    }

    @PostMapping("/creatives/{id}/reject")
    public ResponseEntity<ApiResource<AdminAdCreativeResource>> reject(
            @PathVariable("id") Long id,
            @Valid @RequestBody ReviewAdCreativeRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adCreativeService.reject(id, request, actor(principal, httpRequest)),
                "Artwork rejected!");
    }
}
