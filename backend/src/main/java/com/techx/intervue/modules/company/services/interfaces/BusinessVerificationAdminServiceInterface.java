package com.techx.intervue.modules.company.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.company.enums.AgreementStatus;
import com.techx.intervue.modules.company.requests.ApproveDocumentRequest;
import com.techx.intervue.modules.company.requests.ReviewDocumentRequest;
import com.techx.intervue.modules.company.requests.RevokeDocumentRequest;
import com.techx.intervue.modules.company.requests.SearchBusinessVerificationRequest;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationDetailResource;
import com.techx.intervue.modules.company.resources.AdminBusinessVerificationListResource;
import com.techx.intervue.modules.company.resources.AdminCompanyAgreementResource;
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

    StoredDocumentContent readIdentityDocument(Long documentId);

    AdminBusinessVerificationDetailResource approve(
            Long documentId, ApproveDocumentRequest request, RequestActor actor);

    AdminBusinessVerificationDetailResource reject(
            Long documentId, ReviewDocumentRequest request, RequestActor actor);

    AdminBusinessVerificationDetailResource requestMoreInformation(
            Long documentId, ReviewDocumentRequest request, RequestActor actor);

    AdminBusinessVerificationDetailResource revoke(
            Long documentId, RevokeDocumentRequest request, RequestActor actor);

    Page<AdminCompanyAgreementResource> searchAgreements(AgreementStatus status, Pageable pageable);

    StoredDocumentContent readAgreement(Long agreementId);

    void approveAgreement(Long agreementId, RequestActor actor);

    void rejectAgreement(Long agreementId, ReviewDocumentRequest request, RequestActor actor);

    int expireLapsedAuthorizations();
}
