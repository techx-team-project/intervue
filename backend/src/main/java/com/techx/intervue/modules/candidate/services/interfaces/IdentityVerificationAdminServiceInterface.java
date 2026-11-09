package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.candidate.requests.RejectIdentityVerificationRequest;
import com.techx.intervue.modules.candidate.requests.SearchIdentityVerificationRequest;
import com.techx.intervue.modules.candidate.resources.AdminIdentityVerificationResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface.StoredDocumentContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IdentityVerificationAdminServiceInterface {

    enum DocumentSide {
        FRONT,
        BACK,
        SELFIE
    }

    Page<AdminIdentityVerificationResource> search(
            SearchIdentityVerificationRequest request, Pageable pageable);

    AdminIdentityVerificationResource findOne(Long id);

    StoredDocumentContent readDocument(Long id, DocumentSide side, RequestActor actor);

    AdminIdentityVerificationResource approve(Long id, RequestActor actor);

    AdminIdentityVerificationResource reject(
            Long id, RejectIdentityVerificationRequest request, RequestActor actor);

    AdminIdentityVerificationResource grantAttempts(Long id, RequestActor actor);
}
