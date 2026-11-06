package com.techx.intervue.modules.notification.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.requests.MarkAllReadRequest;
import com.techx.intervue.modules.notification.requests.SearchNotificationRequest;
import com.techx.intervue.modules.notification.requests.UpdatePreferencesRequest;
import com.techx.intervue.modules.notification.resources.NotificationDetailResource;
import com.techx.intervue.modules.notification.resources.NotificationListResource;
import com.techx.intervue.modules.notification.resources.NotificationPreferenceResource;
import com.techx.intervue.modules.notification.resources.UnreadCountResource;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPreferenceServiceInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationQueryServiceInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationStateServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequiredArgsConstructor
public abstract class AbstractNotificationController extends BaseController {

    protected final NotificationQueryServiceInterface queryService;
    protected final NotificationStateServiceInterface stateService;
    protected final NotificationPreferenceServiceInterface preferenceService;

    protected abstract RecipientType recipientType();

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<NotificationListResource>>> list(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid SearchNotificationRequest request,
            Pageable pageable) {
        return page(
                queryService.search(recipientType(), principal.getId(), request, pageable),
                "Notifications retrieved successfully!");
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResource<UnreadCountResource>> unreadCount(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                queryService.unreadCount(recipientType(), principal.getId()),
                "Unread count retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<NotificationDetailResource>> detail(
            @AuthenticationPrincipal CustomUserDetails principal, @PathVariable Long id) {
        return ok(
                queryService.getDetail(recipientType(), principal.getId(), id),
                "Notification retrieved successfully!");
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<ApiResource<Void>> markRead(
            @AuthenticationPrincipal CustomUserDetails principal, @PathVariable Long id) {
        stateService.markRead(recipientType(), principal.getId(), id);
        return ok(null, "Notification marked as read!");
    }

    @PostMapping("/read-all")
    public ResponseEntity<ApiResource<Integer>> markAllRead(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody(required = false) MarkAllReadRequest request) {
        int updated =
                stateService.markAllRead(
                        recipientType(),
                        principal.getId(),
                        request == null ? null : request.category());
        return ok(updated, "All notifications marked as read!");
    }

    @PostMapping("/seen")
    public ResponseEntity<ApiResource<Integer>> markAllSeen(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                stateService.markAllSeen(recipientType(), principal.getId()),
                "Notifications marked as seen!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResource<Void>> archive(
            @AuthenticationPrincipal CustomUserDetails principal, @PathVariable Long id) {
        stateService.archive(recipientType(), principal.getId(), id);
        return ok(null, "Notification archived!");
    }

    @GetMapping("/preferences")
    public ResponseEntity<ApiResource<List<NotificationPreferenceResource>>> preferences(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                preferenceService.findAll(recipientType(), principal.getId()),
                "Notification preferences retrieved successfully!");
    }

    @PutMapping("/preferences")
    public ResponseEntity<ApiResource<List<NotificationPreferenceResource>>> updatePreferences(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody UpdatePreferencesRequest request) {
        return ok(
                preferenceService.update(recipientType(), principal.getId(), request),
                "Notification preferences updated successfully!");
    }
}
