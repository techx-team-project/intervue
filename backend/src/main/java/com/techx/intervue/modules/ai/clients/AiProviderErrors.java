package com.techx.intervue.modules.ai.clients;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import java.net.SocketTimeoutException;
import java.net.http.HttpTimeoutException;
import java.time.Duration;
import org.springframework.core.retry.RetryPolicy;
import org.springframework.core.retry.RetryTemplate;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;

public final class AiProviderErrors {

    private static final Duration RETRY_DELAY = Duration.ofMillis(500);

    private AiProviderErrors() {}

    public static void requireApiKey(String apiKey) {
        requireConfigured(apiKey);
    }

    public static void requireConfigured(String value) {
        if (value == null || value.isBlank()) {
            throw new AppException(ErrorCode.AI_NOT_CONFIGURED);
        }
    }

    public static RetryTemplate retryTemplate(int maxRetries) {
        return new RetryTemplate(
                RetryPolicy.builder()
                        .maxRetries(maxRetries)
                        .delay(RETRY_DELAY)
                        .multiplier(2)
                        .predicate(AiProviderErrors::isTransient)
                        .build());
    }

    public static boolean isTransient(Throwable failure) {
        if (failure instanceof RestClientResponseException ex) {
            return isRetryableStatus(ex.getStatusCode().value());
        }
        return failure instanceof ResourceAccessException;
    }

    public static AppException fromStatus(int status) {
        return new AppException(errorCodeFor(status));
    }

    public static AppException fromIoFailure(Throwable failure) {
        return new AppException(
                isTimeout(failure) ? ErrorCode.AI_PROVIDER_TIMEOUT : ErrorCode.AI_PROVIDER_BUSY);
    }

    public static boolean isRetryableStatus(int status) {
        return status == 429 || status >= 500;
    }

    private static ErrorCode errorCodeFor(int status) {
        return switch (status) {
            case 401, 403 -> ErrorCode.AI_NOT_CONFIGURED;
            case 408 -> ErrorCode.AI_PROVIDER_TIMEOUT;
            default ->
                    isRetryableStatus(status)
                            ? ErrorCode.AI_PROVIDER_BUSY
                            : ErrorCode.AI_PROVIDER_ERROR;
        };
    }

    private static boolean isTimeout(Throwable failure) {
        for (Throwable cause = failure; cause != null; cause = cause.getCause()) {
            if (cause instanceof SocketTimeoutException || cause instanceof HttpTimeoutException) {
                return true;
            }
        }
        return false;
    }
}
