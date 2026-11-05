package com.techx.intervue.modules.company.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.company.requests.JoinCompanyRequest;
import com.techx.intervue.modules.company.requests.SaveCompanyProfileRequest;
import com.techx.intervue.modules.company.requests.SearchCompaniesRequest;
import com.techx.intervue.modules.company.resources.CompanyResource;
import com.techx.intervue.modules.company.resources.CompanySummaryResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/recruiter/company")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterCompanyController extends BaseController {

    private final CompanyServiceInterface companyService;

    @GetMapping
    public ResponseEntity<ApiResource<CompanyResource>> myCompany(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                companyService.findMyCompany(principal.getId()),
                "Company profile retrieved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<CompanyResource>> create(
            @Valid @RequestBody SaveCompanyProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return created(
                companyService.create(request, actor(principal, httpRequest)),
                "Company created successfully!");
    }

    @PutMapping
    public ResponseEntity<ApiResource<CompanyResource>> update(
            @Valid @RequestBody SaveCompanyProfileRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                companyService.update(request, actor(principal, httpRequest)),
                "Company profile updated successfully!");
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResource<PageResource<CompanySummaryResource>>> search(
            @Valid SearchCompaniesRequest request, Pageable pageable) {
        return page(companyService.search(request, pageable), "Companies retrieved successfully!");
    }

    @PostMapping("/join")
    public ResponseEntity<ApiResource<CompanyResource>> join(
            @Valid @RequestBody JoinCompanyRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                companyService.join(request, actor(principal, httpRequest)),
                "Company joined successfully!");
    }

    @PostMapping("/leave")
    public ResponseEntity<ApiResource<Void>> leave(
            @AuthenticationPrincipal CustomUserDetails principal, HttpServletRequest httpRequest) {
        companyService.leave(actor(principal, httpRequest));
        return ok(null, "You have left the company successfully!");
    }

    @PostMapping(value = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResource<CompanyResource>> replaceLogo(
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                companyService.replaceLogo(file, principal.getId()),
                "Company logo uploaded successfully!");
    }

    @PostMapping(value = "/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResource<CompanyResource>> addPhotos(
            @RequestPart("files") List<MultipartFile> files,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                companyService.addPhotos(files, principal.getId()),
                "Company photos uploaded successfully!");
    }

    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<ApiResource<CompanyResource>> removePhoto(
            @PathVariable Long photoId, @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                companyService.removePhoto(photoId, principal.getId()),
                "Company photo removed successfully!");
    }
}
