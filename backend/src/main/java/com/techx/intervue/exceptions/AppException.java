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
        this(errorCode, errorCode.getMessage(), List.of(), Map.of(), null);
    }

    private AppException(
            ErrorCode errorCode,
            List<FieldErrorResource> details,
            Map<String, Object> meta,
            Long retryAfterSeconds) {
        this(errorCode, errorCode.getMessage(), details, meta, retryAfterSeconds);
    }

    private AppException(
            ErrorCode errorCode,
            String customMessage,
            List<FieldErrorResource> details,
            Map<String, Object> meta,
            Long retryAfterSeconds) {
        super(customMessage != null ? customMessage : errorCode.getMessage());
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
        return rateLimited(ErrorCode.RATE_LIMITED, retryAfterSeconds);
    }

    public static AppException rateLimited(ErrorCode errorCode, long retryAfterSeconds) {
        return new AppException(errorCode, List.of(), Map.of(), retryAfterSeconds);
    }

    public static AppException phoneOtpInvalid(int remainingAttempts) {
        String message =
                remainingAttempts == 1
                        ? "Invalid verification code. You have 1 attempt remaining!"
                        : "Invalid verification code. You have "
                                + remainingAttempts
                                + " attempts remaining.";
        FieldErrorResource detail =
                FieldErrorResource.builder().field("code").message(message).build();
        return new AppException(
                ErrorCode.PHONE_OTP_INVALID,
                message,
                List.of(detail),
                Map.of("remainingAttempts", remainingAttempts),
                null);
    }

    public static AppException phoneOtpAttemptsExceeded() {
        return new AppException(
                ErrorCode.PHONE_OTP_ATTEMPTS_EXCEEDED,
                ErrorCode.PHONE_OTP_ATTEMPTS_EXCEEDED.getMessage(),
                List.of(),
                Map.of("remainingAttempts", 0),
                null);
    }
}
