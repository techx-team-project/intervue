package com.techx.intervue.modules.recruiter.services.interfaces;

import com.techx.intervue.modules.recruiter.requests.RecruiterProfileRequest;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;

public interface RecruiterServiceInterface {

    RecruiterResource getMe(Long recruiterId);

    RecruiterResource updateProfile(Long recruiterId, RecruiterProfileRequest request);

    java.util.List<RecruiterResource> findByIds(java.util.Collection<Long> recruiterIds);

    java.util.List<Long> findActiveIds();

    void requestAccountDeletion(Long recruiterId);

    RecruiterResource cancelAccountDeletion(Long recruiterId);

    int purgeExpiredPendingDeletions();
}
