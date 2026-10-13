package com.techx.intervue.exceptions;

import com.techx.intervue.resources.FieldErrorResource;
import java.util.List;
import java.util.Map;
import lombok.Getter;

@Getter
public class AppException extends RuntimeException {
    private final ErrorCode errorCode;
    private final List<FieldErrorResource> details;
    private final Map<String, Object> meta;
    private final Long retryAfterSeconds;

    public AppException(ErrorCode errorCode) {
        this(errorCode, List.of(), Map.of(), null);
    }

    private AppException(
            ErrorCode errorCode,
            List<FieldErrorResource> details,
            Map<String, Object> meta,
            Long retryAfterSeconds) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
        this.details = details;
        this.meta = meta;
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public static AppException validation(String field, String message) {
        FieldErrorResource detail =
                FieldErrorResource.builder().field(field).message(message).build();
        return new AppException(ErrorCode.VALIDATION_FAILED, List.of(detail), Map.of(), null);
    }

    public static AppException invalidCredentials(boolean captchaRequired) {
        return new AppException(
                ErrorCode.INVALID_CREDENTIALS,
                List.of(),
                Map.of("captchaRequired", captchaRequired),
                null);
    }

    public static AppException rateLimited(long retryAfterSeconds) {
        return new AppException(ErrorCode.RATE_LIMITED, List.of(), Map.of(), retryAfterSeconds);
    }
}
