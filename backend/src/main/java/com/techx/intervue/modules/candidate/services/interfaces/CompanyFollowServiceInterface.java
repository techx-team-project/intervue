package com.techx.intervue.modules.candidate.services.interfaces;

import com.techx.intervue.modules.candidate.resources.FollowedCompanyResource;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompanyFollowServiceInterface {

    Page<FollowedCompanyResource> list(Long candidateId, Pageable pageable);

    List<Long> listIds(Long candidateId);

    void follow(Long candidateId, Long companyId);

    void unfollow(Long candidateId, Long companyId);
}
