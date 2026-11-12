package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.clients.AiClient;
import com.techx.intervue.modules.ai.clients.EmbeddingClient;
import com.techx.intervue.modules.ai.requests.AiCallContext;
import com.techx.intervue.modules.ai.requests.AiChatRequest;
import com.techx.intervue.modules.ai.requests.EmbeddingRequest;
import com.techx.intervue.modules.ai.resources.AiChatResult;
import com.techx.intervue.modules.ai.resources.AiUsage;
import com.techx.intervue.modules.ai.resources.EmbeddingResult;
import com.techx.intervue.modules.ai.resources.PromptTemplate;
import com.techx.intervue.modules.ai.services.interfaces.AiGatewayServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.AiQuotaServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.AiUsageLogServiceInterface;
import com.techx.intervue.modules.ai.services.interfaces.PromptServiceInterface;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.function.Supplier;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiGatewayService implements AiGatewayServiceInterface {

    private static final String GUARD_PROMPT = "untrusted-input-guard";
    private static final int GUARD_VERSION = 1;

    private final AiClient aiClient;
    private final EmbeddingClient embeddingClient;
    private final AiQuotaServiceInterface quotaService;
    private final AiUsageLogServiceInterface usageLog;
    private final PromptServiceInterface promptService;

    @Override
    public AiChatResult chat(AiCallContext context, AiChatRequest request) {
        PromptTemplate guard = promptService.load(GUARD_PROMPT, GUARD_VERSION);
        AiChatRequest guarded = request.withSystem(request.system().withPreamble(guard));
        return execute(
                context,
                aiClient.model(),
                request.system().id(),
                () -> aiClient.chat(guarded),
                AiChatResult::usage);
    }

    @Override
    public EmbeddingResult embed(AiCallContext context, EmbeddingRequest request) {
        return execute(
                context,
                embeddingClient.model(),
                null,
                () -> embeddingClient.embed(request),
                EmbeddingResult::usage);
    }

    private <T> T execute(
            AiCallContext context,
            String model,
            String promptVersion,
            Supplier<T> call,
            Function<T, AiUsage> usageOf) {
        if (context.chargeQuota()) {
            quotaService.reserve(context.userId());
        }
        long startedAt = System.nanoTime();
        try {
            T result = call.get();
            usageLog.recordSuccess(
                    context.feature(),
                    model,
                    promptVersion,
                    usageOf.apply(result),
                    elapsed(startedAt));
            return result;
        } catch (RuntimeException ex) {
            if (context.chargeQuota()) {
                quotaService.release(context.userId());
            }
            usageLog.recordFailure(
                    context.feature(), model, promptVersion, errorCodeOf(ex), elapsed(startedAt));
            throw ex;
        }
    }

    private ErrorCode errorCodeOf(RuntimeException ex) {
        return ex instanceof AppException appException
                ? appException.getErrorCode()
                : ErrorCode.AI_PROVIDER_ERROR;
    }

    private long elapsed(long startedAt) {
        return TimeUnit.NANOSECONDS.toMillis(System.nanoTime() - startedAt);
    }
}
