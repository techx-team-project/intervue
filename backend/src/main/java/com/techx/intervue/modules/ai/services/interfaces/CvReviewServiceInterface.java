package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.requests.CvReviewRequest;
import com.techx.intervue.modules.ai.resources.CvReviewQuotaResource;
import com.techx.intervue.modules.ai.resources.CvReviewResult;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface CvReviewServiceInterface {

    CvReviewResult reviewCv(Long candidateUserId, String ip, CvReviewRequest request);

    CvReviewResult reviewUploadedPdf(
            Long candidateUserId, String ip, MultipartFile file, String targetPosition, Long jobId);

    default CvReviewResult reviewUploadedPdf(
            Long candidateUserId, String ip, MultipartFile file, String targetPosition) {
        return reviewUploadedPdf(candidateUserId, ip, file, targetPosition, null);
    }

    CvReviewResult getReviewById(Long candidateUserId, Long reviewId);

    List<CvReviewResult> getCandidateReviews(Long candidateUserId);

    CvReviewQuotaResource getQuota(Long candidateUserId);
}
