package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.entities.AiRequest;
import com.techx.intervue.modules.ai.enums.AiRequestStatus;
import com.techx.intervue.modules.ai.repositories.AiRequestRepository;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.services.interfaces.AiUsageLogServiceInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiUsageLogService implements AiUsageLogServiceInterface {

    private final AiRequestRepository repository;

    @Override
    public void recordSuccess(
            String feature, String model, String promptVersion, AiUsage usage, long durationMs) {
        save(
                AiRequest.builder()
                        .feature(feature)
                        .model(model)
                        .promptVersion(promptVersion)
                        .inputTokens(usage.inputTokens())
                        .outputTokens(usage.outputTokens())
                        .status(AiRequestStatus.SUCCESS)
                        .durationMs(clampDuration(durationMs))
                        .build());
    }

    @Override
    public void recordFailure(
            String feature,
            String model,
            String promptVersion,
            ErrorCode errorCode,
            long durationMs) {
        save(
                AiRequest.builder()
                        .feature(feature)
                        .model(model)
                        .promptVersion(promptVersion)
                        .status(AiRequestStatus.FAILED)
                        .errorCode(errorCode.name())
                        .durationMs(clampDuration(durationMs))
                        .build());
    }

    private void save(AiRequest request) {
        try {
            repository.save(request);
        } catch (DataAccessException ex) {
            log.warn(
                    "Could not record the AI request log for feature {}", request.getFeature(), ex);
        }
    }

    private int clampDuration(long durationMs) {
        return (int) Math.min(durationMs, Integer.MAX_VALUE);
    }
}
