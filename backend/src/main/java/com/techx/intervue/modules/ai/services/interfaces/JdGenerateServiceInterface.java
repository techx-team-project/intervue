package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.requests.JdGenerateRequest;
import com.techx.intervue.modules.ai.resources.JdGenerateResult;

public interface JdGenerateServiceInterface {

    JdGenerateResult generate(Long recruiterUserId, String ip, JdGenerateRequest request);
}
