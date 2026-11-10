package com.techx.intervue.modules.ads.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.ads.requests.SaveAdCreativeRequest;
import com.techx.intervue.modules.ads.resources.AdSlotCalendarResource;
import com.techx.intervue.modules.ads.resources.AdSlotResource;
import com.techx.intervue.modules.ads.resources.RecruiterAdBookingResource;
import com.techx.intervue.modules.ads.services.interfaces.AdBookingServiceInterface;
import com.techx.intervue.modules.ads.services.interfaces.AdCreativeServiceInterface;
import com.techx.intervue.modules.ads.services.interfaces.AdSlotServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/recruiter/ads")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterAdController extends BaseController {

    private static final int DEFAULT_WEEKS_AHEAD = 12;

    private final AdSlotServiceInterface adSlotService;
    private final AdBookingServiceInterface adBookingService;
    private final AdCreativeServiceInterface adCreativeService;
    private final CompanyServiceInterface companyService;

    @GetMapping("/slots")
    public ResponseEntity<ApiResource<List<AdSlotResource>>> slots() {
        return ok(adSlotService.listActive(), "Ad slots retrieved successfully!");
    }

    @GetMapping("/slots/{code}/calendar")
    public ResponseEntity<ApiResource<AdSlotCalendarResource>> calendar(
            @PathVariable("code") String code,
            @RequestParam(value = "weeks", defaultValue = "" + DEFAULT_WEEKS_AHEAD) int weeks,
            @AuthenticationPrincipal CustomUserDetails principal) {
        Long companyId = companyService.findMyCompany(principal.getId()).id();
        return ok(
                adSlotService.calendar(code, weeks, companyId),
                "Ad slot calendar retrieved successfully!");
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResource<List<RecruiterAdBookingResource>>> bookings(
            @AuthenticationPrincipal CustomUserDetails principal) {
        Long companyId = companyService.findMyCompany(principal.getId()).id();
        return ok(
                adBookingService.listForCompany(companyId), "Ad bookings retrieved successfully!");
    }

    @PostMapping("/bookings/{id}/creative")
    public ResponseEntity<ApiResource<RecruiterAdBookingResource>> uploadCreative(
            @PathVariable("id") Long id,
            @RequestPart("file") MultipartFile file,
            @Valid @RequestPart("data") SaveAdCreativeRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                adCreativeService.upload(id, file, request, principal.getId()),
                "Artwork uploaded and sent for review!");
    }
}
