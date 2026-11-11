package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.resources.ResumeMatchResult;

public interface ApplicationResumeMatchServiceInterface {

    ResumeMatchResult analyze(Long recruiterId, String ip, Long applicationId);
}
