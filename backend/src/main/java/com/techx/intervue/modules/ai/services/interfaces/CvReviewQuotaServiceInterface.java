package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.CvReviewQuotaResource;

public interface CvReviewQuotaServiceInterface {

    CvReviewQuotaResource getQuota(Long candidateUserId);

    void checkAndConsumeQuota(Long candidateUserId);

    void releaseQuota(Long candidateUserId);
}
