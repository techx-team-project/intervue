package com.techx.intervue.modules.jobalert.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.jobalert.requests.UnsubscribeActionRequest;
import com.techx.intervue.modules.jobalert.resources.JobAlertUnsubscribeResource;
import com.techx.intervue.modules.jobalert.services.interfaces.JobAlertServiceInterface;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/job-alerts")
@RequiredArgsConstructor
public class PublicJobAlertController extends BaseController {

    private final JobAlertServiceInterface alertService;

    @GetMapping("/unsubscribe")
    public ResponseEntity<ApiResource<JobAlertUnsubscribeResource>> getUnsubscribeInfo(
            @RequestParam("token") String token) {
        return ok(
                alertService.getUnsubscribeInfo(token), "Job alert details retrieved successfully");
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<ApiResource<Void>> processUnsubscribe(
            @Valid @RequestBody UnsubscribeActionRequest request) {
        alertService.processUnsubscribe(request);
        return ok(null, "Unsubscription processed successfully");
    }
}
