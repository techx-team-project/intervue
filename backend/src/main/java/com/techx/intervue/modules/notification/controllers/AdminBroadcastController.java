package com.techx.intervue.modules.notification.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.notification.requests.CreateBroadcastRequest;
import com.techx.intervue.modules.notification.requests.SearchBroadcastRequest;
import com.techx.intervue.modules.notification.requests.UpdateBroadcastRequest;
import com.techx.intervue.modules.notification.resources.AdminBroadcastResource;
import com.techx.intervue.modules.notification.resources.AudiencePreviewResource;
import com.techx.intervue.modules.notification.services.interfaces.AdminBroadcastServiceInterface;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/notifications/broadcasts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBroadcastController extends BaseController {

    private final AdminBroadcastServiceInterface broadcastService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminBroadcastResource>>> search(
            @Valid SearchBroadcastRequest request, Pageable pageable) {
        return page(
                broadcastService.search(request, pageable), "Broadcasts retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<AdminBroadcastResource>> detail(@PathVariable Long id) {
        return ok(broadcastService.getById(id), "Broadcast retrieved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<AdminBroadcastResource>> create(
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest,
            @Valid @RequestBody CreateBroadcastRequest request) {
        return created(
                broadcastService.create(request, actor(principal, httpRequest)),
                "Broadcast created successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<AdminBroadcastResource>> update(
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest,
            @PathVariable Long id,
            @Valid @RequestBody UpdateBroadcastRequest request) {
        return ok(
                broadcastService.update(id, request, actor(principal, httpRequest)),
                "Broadcast updated successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResource<Void>> delete(
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest,
            @PathVariable Long id) {
        broadcastService.delete(id, actor(principal, httpRequest));
        return ok(null, "Broadcast deleted successfully!");
    }

    @GetMapping("/{id}/audience-preview")
    public ResponseEntity<ApiResource<AudiencePreviewResource>> previewAudience(
            @PathVariable Long id) {
        return ok(broadcastService.previewAudience(id), "Audience preview retrieved!");
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<ApiResource<AdminBroadcastResource>> send(
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest,
            @PathVariable Long id) {
        return ok(
                broadcastService.send(id, actor(principal, httpRequest)),
                "Broadcast is being delivered!");
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResource<AdminBroadcastResource>> cancel(
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest,
            @PathVariable Long id) {
        return ok(
                broadcastService.cancel(id, actor(principal, httpRequest)),
                "Broadcast cancelled successfully!");
    }
}
