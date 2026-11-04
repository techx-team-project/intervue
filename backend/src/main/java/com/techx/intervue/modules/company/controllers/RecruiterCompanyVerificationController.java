package com.techx.intervue.modules.company.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.company.enums.AgreementType;
import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.requests.AcceptAgreementRequest;
import com.techx.intervue.modules.company.requests.SubmitBusinessDocumentRequest;
import com.techx.intervue.modules.company.resources.BusinessDocumentResource;
import com.techx.intervue.modules.company.resources.RecruiterVerificationProfileResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface.AgreementTemplate;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface.StoredDocumentContent;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/recruiter/company")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterCompanyVerificationController extends BaseController {

    private final CompanyVerificationServiceInterface verificationService;

    @GetMapping("/verification")
    public ResponseEntity<ApiResource<RecruiterVerificationProfileResource>> verification(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                verificationService.findProfile(principal.getId()),
                "Verification profile retrieved successfully!");
    }

    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResource<BusinessDocumentResource>> submitDocument(
            @RequestParam("documentType") BusinessDocumentType documentType,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return created(
                verificationService.submitDocument(
                        file,
                        new SubmitBusinessDocumentRequest(documentType),
                        actor(principal, httpRequest)),
                "Document submitted successfully! It is now awaiting review.");
    }

    @GetMapping("/documents")
    public ResponseEntity<ApiResource<List<BusinessDocumentResource>>> documents(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                verificationService.findDocuments(principal.getId()),
                "Documents retrieved successfully!");
    }

    // Streams the bytes instead of returning the envelope: a stored document is binary, and it is
    // served inline so reviewing it never puts an untrusted file on anyone's machine.
    @GetMapping("/documents/{documentId}/view")
    public ResponseEntity<byte[]> viewDocument(
            @PathVariable Long documentId, @AuthenticationPrincipal CustomUserDetails principal) {
        StoredDocumentContent content =
                verificationService.readDocument(documentId, principal.getId());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(content.contentType()))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(content.fileName()).build().toString())
                .body(content.bytes());
    }

    @PostMapping("/agreements")
    public ResponseEntity<ApiResource<Void>> acceptAgreement(
            @Valid @RequestBody AcceptAgreementRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        verificationService.acceptAgreement(request, actor(principal, httpRequest));
        return ok(null, "Agreement accepted successfully!");
    }

    @PostMapping(value = "/agreements/custom", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResource<Void>> acceptCustomAgreement(
            @RequestParam("agreementType") AgreementType agreementType,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        verificationService.acceptCustomAgreement(
                file, new AcceptAgreementRequest(agreementType), actor(principal, httpRequest));
        return ok(null, "Custom agreement uploaded successfully! It is now awaiting review.");
    }

    @GetMapping("/agreements/template/{agreementType}")
    public ResponseEntity<String> agreementTemplate(@PathVariable AgreementType agreementType) {
        AgreementTemplate template = verificationService.findTemplate(agreementType);
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(template.fileName())
                                .build()
                                .toString())
                .body(template.content());
    }
}
