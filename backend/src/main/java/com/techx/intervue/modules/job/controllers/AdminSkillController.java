package com.techx.intervue.modules.job.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.job.requests.AdminSearchSkillsRequest;
import com.techx.intervue.modules.job.requests.SaveSkillRequest;
import com.techx.intervue.modules.job.resources.AdminSkillResource;
import com.techx.intervue.modules.job.services.interfaces.AdminSkillServiceInterface;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/skills")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSkillController extends BaseController {

    private final AdminSkillServiceInterface adminSkillService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminSkillResource>>> search(
            @Valid AdminSearchSkillsRequest request, Pageable pageable) {
        return page(adminSkillService.search(request, pageable), "Skills retrieved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<AdminSkillResource>> create(
            @Valid @RequestBody SaveSkillRequest request) {
        return created(adminSkillService.create(request), "Skill created successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<AdminSkillResource>> update(
            @PathVariable Long id, @Valid @RequestBody SaveSkillRequest request) {
        return ok(adminSkillService.update(id, request), "Skill updated successfully!");
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<ApiResource<AdminSkillResource>> activate(@PathVariable Long id) {
        return ok(adminSkillService.setActive(id, true), "Skill activated successfully!");
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<ApiResource<AdminSkillResource>> deactivate(@PathVariable Long id) {
        return ok(adminSkillService.setActive(id, false), "Skill deactivated successfully!");
    }
}
