package com.techx.intervue.modules.user.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.user.requests.SearchUsersRequest;
import com.techx.intervue.modules.user.resources.AdminUserDetailResource;
import com.techx.intervue.modules.user.resources.AdminUserListResource;
import com.techx.intervue.modules.user.resources.AdminUserSummaryResource;
import com.techx.intervue.modules.user.services.interfaces.UserAdminServiceInterface;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController extends BaseController {

    private final UserAdminServiceInterface userAdminService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminUserListResource>>> search(
            @Valid SearchUsersRequest request, Pageable pageable) {
        return ok(
                PageResource.of(userAdminService.search(request, pageable)),
                "Accounts retrieved successfully!");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResource<AdminUserSummaryResource>> summary() {
        return ok(userAdminService.summarise(), "Account summary retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<AdminUserDetailResource>> detail(@PathVariable Long id) {
        return ok(userAdminService.findDetail(id), "Account details retrieved successfully!");
    }
}
