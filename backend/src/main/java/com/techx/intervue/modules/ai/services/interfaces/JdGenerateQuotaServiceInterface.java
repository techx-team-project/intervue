package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.JdGenerateQuotaResource;

public interface JdGenerateQuotaServiceInterface {

    JdGenerateQuotaResource getQuota(Long recruiterUserId);

    void assertHasQuota(Long recruiterUserId);

    void consume(Long recruiterUserId);
}
