package com.techx.intervue.modules.company.services.interfaces;

import com.techx.intervue.modules.company.requests.ApproveDocumentRequest;
import com.techx.intervue.modules.company.requests.ReviewDocumentRequest;
import com.techx.intervue.modules.company.requests.RevokeDocumentRequest;
import com.techx.intervue.modules.company.requests.SearchBusinessVerificationRequest;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationDetailResource;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationListResource;
import com.techx.intervue.modules.company.resources.BusinessVerificationSummaryResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface.StoredDocumentContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BusinessVerificationAdminServiceInterface {

    Page<AdminBusinessVerificationListResource> search(
            SearchBusinessVerificationRequest request, Pageable pageable);

    BusinessVerificationSummaryResource summarise();

    AdminBusinessVerificationDetailResource findDetail(Long documentId);

    StoredDocumentContent readDocument(Long documentId);

    AdminBusinessVerificationDetailResource approve(
            Long documentId, ApproveDocumentRequest request, AdminActor actor);

    AdminBusinessVerificationDetailResource reject(
            Long documentId, ReviewDocumentRequest request, AdminActor actor);

    AdminBusinessVerificationDetailResource requestMoreInformation(
            Long documentId, ReviewDocumentRequest request, AdminActor actor);

    AdminBusinessVerificationDetailResource revoke(
            Long documentId, RevokeDocumentRequest request, AdminActor actor);

    int expireLapsedAuthorizations();
}
