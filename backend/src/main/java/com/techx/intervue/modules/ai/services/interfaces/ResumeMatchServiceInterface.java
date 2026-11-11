package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.requests.ResumeMatchRequest;
import com.techx.intervue.modules.ai.resources.ResumeMatchResult;

public interface ResumeMatchServiceInterface {

    ResumeMatchResult analyze(Long recruiterUserId, String ip, ResumeMatchRequest request);
}
