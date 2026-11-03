package com.techx.intervue.modules.candidate.mappers;

import com.techx.intervue.common.storage.StorageServiceInterface;
import com.techx.intervue.modules.candidate.entities.CandidateCertification;
import com.techx.intervue.modules.candidate.requests.SaveCandidateCertificationRequest;
import com.techx.intervue.modules.candidate.resources.CandidateCertificationResource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CandidateCertificationMapper {

    private final StorageServiceInterface storageService;

    public void apply(
            CandidateCertification certification, SaveCandidateCertificationRequest request) {
        certification.setName(request.name().trim());
        certification.setIssuer(request.issuer().trim());
        certification.setIssueDate(request.issueDate());
        certification.setCredentialId(blankToNull(request.credentialId()));
        certification.setCredentialUrl(blankToNull(request.credentialUrl()));
    }

    public CandidateCertificationResource toResource(CandidateCertification certification) {
        String imagePublicId = certification.getImagePublicId();
        return CandidateCertificationResource.builder()
                .id(certification.getId())
                .name(certification.getName())
                .issuer(certification.getIssuer())
                .issueDate(certification.getIssueDate())
                .credentialId(certification.getCredentialId())
                .credentialUrl(certification.getCredentialUrl())
                .imageUrl(
                        imagePublicId == null ? null : storageService.publicImageUrl(imagePublicId))
                .build();
    }

    private String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
