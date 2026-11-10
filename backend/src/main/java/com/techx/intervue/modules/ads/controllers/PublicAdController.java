package com.techx.intervue.modules.ads.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.ads.resources.ServedAdResource;
import com.techx.intervue.modules.ads.services.interfaces.AdServingServiceInterface;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ads")
@RequiredArgsConstructor
public class PublicAdController extends BaseController {

    private final AdServingServiceInterface adServingService;

    @GetMapping("/slots/{code}")
    public ResponseEntity<ApiResource<ServedAdResource>> serve(@PathVariable("code") String code) {
        return ok(adServingService.serve(code).orElse(null), "Ad slot resolved successfully!");
    }

    @PostMapping("/slots/{code}/click")
    public ResponseEntity<ApiResource<Void>> click(
            @PathVariable("code") String code, HttpServletRequest request) {
        adServingService.recordClick(code, IpHelper.getClientIp(request));
        return ok(null, "Click recorded!");
    }
}
