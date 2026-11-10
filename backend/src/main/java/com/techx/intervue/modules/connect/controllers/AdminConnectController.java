package com.techx.intervue.modules.connect.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.connect.resources.MessageResource;
import com.techx.intervue.modules.connect.services.interfaces.ConnectionServiceInterface;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/connect")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminConnectController extends BaseController {

    private final ConnectionServiceInterface connectionService;

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResource<PageResource<MessageResource>>> messages(
            @PathVariable Long id, Pageable pageable) {
        return page(
                connectionService.adminListMessages(id, pageable),
                "Messages retrieved successfully!");
    }
}
