package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.resources.JobRecommendationResponse;

public interface JobRecommendationServiceInterface {

    JobRecommendationResponse getRecommendations(Long candidateUserId, int limit);
}
