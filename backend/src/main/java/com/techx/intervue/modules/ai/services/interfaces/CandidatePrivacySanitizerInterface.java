package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.modules.ai.requests.CandidateRawData;

public interface CandidatePrivacySanitizerInterface {

    String sanitizeCandidateData(CandidateRawData rawData, String rawCvText);

    void validateNoSensitiveDataSent(String sanitizedPayload);
}
