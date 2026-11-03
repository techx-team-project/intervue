package com.techx.intervue.modules.company.services.interfaces;

import com.techx.intervue.modules.company.enums.AgreementType;
import com.techx.intervue.modules.company.requests.AcceptAgreementRequest;
import com.techx.intervue.modules.company.requests.SubmitBusinessDocumentRequest;
import com.techx.intervue.modules.company.resources.BusinessDocumentResource;
import com.techx.intervue.modules.company.resources.RecruiterVerificationProfileResource;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface.RecruiterActor;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface CompanyVerificationServiceInterface {

    record StoredDocumentContent(String fileName, String contentType, byte[] bytes) {}

    record AgreementTemplate(String fileName, String content) {}

    RecruiterVerificationProfileResource findProfile(Long userId);

    void assertCanPublish(Long userId);

    BusinessDocumentResource submitDocument(
            MultipartFile file, SubmitBusinessDocumentRequest request, RecruiterActor actor);

    List<BusinessDocumentResource> findDocuments(Long userId);

    StoredDocumentContent readDocument(Long documentId, Long userId);

    void acceptAgreement(AcceptAgreementRequest request, RecruiterActor actor);

    void acceptCustomAgreement(
            MultipartFile file, AcceptAgreementRequest request, RecruiterActor actor);

    AgreementTemplate findTemplate(AgreementType agreementType);
}
