package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.job.resources.JobResource;

public interface JobReviewServiceInterface {

    JobResource approve(Long jobId, RequestActor actor);

    JobResource reject(Long jobId, String reason, RequestActor actor);
}
