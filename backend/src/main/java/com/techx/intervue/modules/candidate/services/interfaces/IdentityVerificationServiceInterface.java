package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.requests.SubmitIdentityVerificationRequest;
import com.techx.intervue.modules.candidate.resources.IdentityVerificationResource;
import org.springframework.web.multipart.MultipartFile;

public interface IdentityVerificationServiceInterface {

    IdentityVerificationResource findStatus(Long userId);

    IdentityVerificationResource requestManualReview(Long userId);

    IdentityVerificationResource submit(
            Long userId,
            SubmitIdentityVerificationRequest request,
            MultipartFile front,
            MultipartFile back,
            MultipartFile selfie);
}
