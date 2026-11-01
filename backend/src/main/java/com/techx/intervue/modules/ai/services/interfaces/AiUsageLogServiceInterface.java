package com.techx.intervue.modules.ai.services.interfaces;

import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.resources.AiUsage;

public interface AiUsageLogServiceInterface {

    void recordSuccess(
            String feature, String model, String promptVersion, AiUsage usage, long durationMs);

    void recordFailure(
            String feature,
            String model,
            String promptVersion,
            ErrorCode errorCode,
            long durationMs);
}
