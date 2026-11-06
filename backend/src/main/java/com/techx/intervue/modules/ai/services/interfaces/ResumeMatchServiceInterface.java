package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.requests.ResumeMatchRequest;
import com.techx.intervue.modules.ai.resources.ResumeMatchResult;
import java.util.concurrent.CompletableFuture;

public interface ResumeMatchServiceInterface {

    CompletableFuture<ResumeMatchResult> analyzeAsync(
            Long recruiterUserId, String ip, ResumeMatchRequest request);

    ResumeMatchResult analyze(Long recruiterUserId, String ip, ResumeMatchRequest request);
}
