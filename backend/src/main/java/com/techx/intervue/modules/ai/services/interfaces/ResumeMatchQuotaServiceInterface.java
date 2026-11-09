package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.ResumeMatchQuotaResource;

public interface ResumeMatchQuotaServiceInterface {

    ResumeMatchQuotaResource getQuota(Long recruiterUserId);

    void assertHasQuota(Long recruiterUserId);

    void consume(Long recruiterUserId);
}
