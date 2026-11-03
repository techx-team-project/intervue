package com.techx.intervue.modules.company.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.company.requests.ApproveDocumentRequest;
import com.techx.intervue.modules.company.requests.ReviewDocumentRequest;
import com.techx.intervue.modules.company.requests.SearchBusinessVerificationRequest;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationDetailResource;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationListResource;
import com.techx.intervue.modules.company.resources.BusinessVerificationSummaryResource;
import com.techx.intervue.modules.company.services.interfaces.BusinessVerificationAdminServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.BusinessVerificationAdminServiceInterface.AdminActor;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface.StoredDocumentContent;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/business-verification")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBusinessVerificationController extends BaseController {

    private final BusinessVerificationAdminServiceInterface verificationAdminService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminBusinessVerificationListResource>>> search(
            @Valid SearchBusinessVerificationRequest request, Pageable pageable) {
        return ok(
                PageResource.of(verificationAdminService.search(request, pageable)),
                "Business verification requests retrieved successfully!");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResource<BusinessVerificationSummaryResource>> summary() {
        return ok(
                verificationAdminService.summarise(),
                "Business verification summary retrieved successfully!");
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<ApiResource<AdminBusinessVerificationDetailResource>> detail(
            @PathVariable Long documentId) {
        return ok(
                verificationAdminService.findDetail(documentId),
                "Business verification details retrieved successfully!");
    }

    // Streams the bytes instead of returning the envelope, and inline so reviewing a document
    // never puts an untrusted file on a reviewer's machine.
    @GetMapping("/{documentId}/view")
    public ResponseEntity<byte[]> viewDocument(@PathVariable Long documentId) {
        StoredDocumentContent content = verificationAdminService.readDocument(documentId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(content.contentType()))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(content.fileName()).build().toString())
                .body(content.bytes());
    }

    @PostMapping("/{documentId}/approve")
    public ResponseEntity<ApiResource<AdminBusinessVerificationDetailResource>> approve(
            @PathVariable Long documentId,
            @Valid @RequestBody(required = false) ApproveDocumentRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        ApproveDocumentRequest payload =
                request == null ? new ApproveDocumentRequest(null) : request;
        return ok(
                verificationAdminService.approve(
                        documentId, payload, actor(principal, httpRequest)),
                "Document approved successfully!");
    }

    @PostMapping("/{documentId}/reject")
    public ResponseEntity<ApiResource<AdminBusinessVerificationDetailResource>> reject(
            @PathVariable Long documentId,
            @Valid @RequestBody ReviewDocumentRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                verificationAdminService.reject(documentId, request, actor(principal, httpRequest)),
                "Document rejected successfully!");
    }

    @PostMapping("/{documentId}/request-documents")
    public ResponseEntity<ApiResource<AdminBusinessVerificationDetailResource>> requestDocuments(
            @PathVariable Long documentId,
            @Valid @RequestBody ReviewDocumentRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                verificationAdminService.requestMoreInformation(
                        documentId, request, actor(principal, httpRequest)),
                "Additional documents requested successfully!");
    }

    private AdminActor actor(CustomUserDetails principal, HttpServletRequest httpRequest) {
        return new AdminActor(
                principal.getId(), principal.getEmail(), IpHelper.getClientIp(httpRequest));
    }
}
