package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.requests.CoverLetterGenerateRequest;
import com.techx.intervue.modules.ai.resources.CoverLetterGenerateResult;

public interface CoverLetterServiceInterface {

    CoverLetterGenerateResult generateCoverLetter(
            Long candidateUserId, String ip, CoverLetterGenerateRequest request);
}
