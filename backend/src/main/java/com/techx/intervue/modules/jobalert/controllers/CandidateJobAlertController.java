package com.techx.intervue.modules.jobalert.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.jobalert.requests.CreateJobAlertRequest;
import com.techx.intervue.modules.jobalert.requests.UpdateJobAlertRequest;
import com.techx.intervue.modules.jobalert.resources.JobAlertResource;
import com.techx.intervue.modules.jobalert.resources.JobAlertSummaryResource;
import com.techx.intervue.modules.jobalert.services.interfaces.JobAlertServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@RequestMapping("/api/v1/candidate/job-alerts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateJobAlertController extends BaseController {

    private final JobAlertServiceInterface alertService;

    @GetMapping
    public ResponseEntity<ApiResource<List<JobAlertResource>>> list(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                alertService.listCandidateAlerts(principal.getId()),
                "Job alerts retrieved successfully");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResource<JobAlertSummaryResource>> summary(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                alertService.getCandidateSummary(principal.getId()),
                "Job alerts summary retrieved successfully");
    }

    @PostMapping
    public ResponseEntity<ApiResource<JobAlertResource>> create(
            @Valid @RequestBody CreateJobAlertRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return created(
                alertService.createAlert(principal.getId(), request),
                "Job alert created successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<JobAlertResource>> get(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(alertService.getAlert(id, principal.getId()), "Job alert retrieved successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<JobAlertResource>> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobAlertRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                alertService.updateAlert(id, principal.getId(), request),
                "Job alert updated successfully");
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResource<JobAlertResource>> toggle(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                alertService.toggleAlert(id, principal.getId()),
                "Job alert status toggled successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResource<Void>> delete(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        alertService.deleteAlert(id, principal.getId());
        return ok(null, "Job alert deleted successfully");
    }

    @PostMapping("/{id}/test-send")
    public ResponseEntity<ApiResource<Boolean>> sendTestEmail(
            @PathVariable Long id, @AuthenticationPrincipal CustomUserDetails principal) {
        boolean sent = alertService.sendTestAlertEmail(id, principal.getId());
        return ok(
                sent,
                sent
                        ? "Test email digest sent successfully!"
                        : "Could not send test email: no matching jobs found or recipient missing.");
    }
}
