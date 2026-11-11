package com.techx.intervue.modules.job.services.interfaces;

import com.techx.intervue.modules.job.requests.NearbyJobsRequest;
import com.techx.intervue.modules.job.requests.SearchJobsRequest;
import com.techx.intervue.modules.job.resources.NearbyJobResource;
import com.techx.intervue.modules.job.resources.PublicJobResource;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PublicJobServiceInterface {

    Page<PublicJobSummaryResource> search(SearchJobsRequest request, Pageable pageable);

    PublicJobResource findOne(Long jobId);

    List<NearbyJobResource> findNearby(NearbyJobsRequest request);

    boolean isAvailable(Long jobId);

    List<PublicJobSummaryResource> findSummaries(Collection<Long> jobIds);

    Map<Long, Long> findCompanyIdsByJobIds(Collection<Long> jobIds);
}
