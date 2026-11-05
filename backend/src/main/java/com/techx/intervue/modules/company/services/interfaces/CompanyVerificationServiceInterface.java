package com.techx.intervue.modules.company.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.company.enums.AgreementType;
import com.techx.intervue.modules.company.requests.AcceptAgreementRequest;
import com.techx.intervue.modules.company.requests.SubmitBusinessDocumentRequest;
import com.techx.intervue.modules.company.resources.BusinessDocumentResource;
import com.techx.intervue.modules.company.resources.RecruiterVerificationProfileResource;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface CompanyVerificationServiceInterface {

    record StoredDocumentContent(String fileName, String contentType, byte[] bytes) {}

    record AgreementTemplate(String fileName, String content) {}

    RecruiterVerificationProfileResource findProfile(Long userId);

    boolean canPublish(Long userId);

    void assertCanPublish(Long userId);

    BusinessDocumentResource submitDocument(
            MultipartFile file, SubmitBusinessDocumentRequest request, RequestActor actor);

    BusinessDocumentResource submitDocument(
            MultipartFile file,
            MultipartFile identityFile,
            SubmitBusinessDocumentRequest request,
            RequestActor actor);

    BusinessDocumentResource submitDocument(
            MultipartFile file,
            MultipartFile identityFile,
            MultipartFile identityBackFile,
            SubmitBusinessDocumentRequest request,
            RequestActor actor);

    List<BusinessDocumentResource> findDocuments(Long userId);

    StoredDocumentContent readDocument(Long documentId, Long userId);

    StoredDocumentContent readIdentityDocument(Long documentId, Long userId);

    StoredDocumentContent readIdentityBackDocument(Long documentId, Long userId);

    void acceptAgreement(AcceptAgreementRequest request, RequestActor actor);

    void acceptCustomAgreement(
            MultipartFile file, AcceptAgreementRequest request, RequestActor actor);

    AgreementTemplate findTemplate(AgreementType agreementType);
}
