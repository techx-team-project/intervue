package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.requests.RenewJobRequest;
import com.techx.intervue.modules.job.requests.SaveJobRequest;
import com.techx.intervue.modules.job.requests.SearchRecruiterJobsRequest;
import com.techx.intervue.modules.job.requests.SimilarJobsRequest;
import com.techx.intervue.modules.job.resources.JobQuotaResource;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.resources.JobStatusCountsResource;
import com.techx.intervue.modules.job.resources.JobSummaryResource;
import com.techx.intervue.modules.job.resources.SimilarJobResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobServiceInterface {

    JobResource create(SaveJobRequest request, Long recruiterId);

    JobResource update(Long jobId, SaveJobRequest request, Long recruiterId);

    JobResource findOne(Long jobId, Long recruiterId);

    Page<JobSummaryResource> search(
            SearchRecruiterJobsRequest request, Pageable pageable, Long recruiterId);

    JobStatusCountsResource countByStatus(Long recruiterId);

    JobResource publish(Long jobId, Long recruiterId);

    JobResource publishApproved(Long jobId);

    JobResource pause(Long jobId, Long recruiterId);

    JobResource resume(Long jobId, Long recruiterId);

    JobResource close(Long jobId, Long recruiterId);

    JobResource renew(Long jobId, RenewJobRequest request, Long recruiterId);

    JobResource extend(Long jobId, RenewJobRequest request, Long recruiterId);

    JobQuotaResource quota(Long recruiterId);

    List<SimilarJobResource> findSimilar(SimilarJobsRequest request, Long recruiterId);

    void delete(Long jobId, Long recruiterId);
}
