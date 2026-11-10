package com.techx.intervue.modules.connect.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.connect.requests.CreateFilterWordRequest;
import com.techx.intervue.modules.connect.requests.UpdateFilterWordRequest;
import com.techx.intervue.modules.connect.resources.ConnectFilterWordResource;
import com.techx.intervue.modules.connect.resources.MessageResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectFilterWordServiceInterface;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/connect")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminConnectController extends BaseController {

    private final ConnectionServiceInterface connectionService;
    private final ConnectFilterWordServiceInterface filterWordService;

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResource<PageResource<MessageResource>>> messages(
            @PathVariable Long id, Pageable pageable) {
        return page(
                connectionService.adminListMessages(id, pageable),
                "Messages retrieved successfully!");
    }

    @GetMapping("/filter-words")
    public ResponseEntity<ApiResource<PageResource<ConnectFilterWordResource>>> listFilterWords(
            Pageable pageable) {
        return page(filterWordService.list(pageable), "Filter words retrieved successfully!");
    }

    @PostMapping("/filter-words")
    public ResponseEntity<ApiResource<ConnectFilterWordResource>> createFilterWord(
            @Valid @RequestBody CreateFilterWordRequest request) {
        return created(filterWordService.create(request), "Filter word created successfully!");
    }

    @PutMapping("/filter-words/{id}")
    public ResponseEntity<ApiResource<ConnectFilterWordResource>> updateFilterWord(
            @PathVariable Long id, @Valid @RequestBody UpdateFilterWordRequest request) {
        return ok(filterWordService.update(id, request), "Filter word updated successfully!");
    }

    @DeleteMapping("/filter-words/{id}")
    public ResponseEntity<ApiResource<Void>> deleteFilterWord(@PathVariable Long id) {
        filterWordService.delete(id);
        return ok(null, "Filter word deleted successfully!");
    }

    @PatchMapping("/filter-words/{id}/toggle")
    public ResponseEntity<ApiResource<ConnectFilterWordResource>> toggleFilterWord(
            @PathVariable Long id) {
        return ok(filterWordService.toggleActive(id), "Filter word status toggled successfully!");
    }
}
