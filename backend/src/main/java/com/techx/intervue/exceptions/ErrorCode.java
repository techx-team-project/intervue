package com.techx.intervue.exceptions;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "Invalid data!"),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Incorrect login credentials"),
    UNAUTHENTICATED(HttpStatus.UNAUTHORIZED, "Your session is invalid or has expired!"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "You do not have permission to perform this action!"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "Resource not found!"),
    EMAIL_ALREADY_USED(HttpStatus.CONFLICT, "This email is already registered!"),
    EMAIL_ALREADY_VERIFIED(HttpStatus.CONFLICT, "Email is already verified!"),
    INVALID_OR_EXPIRED_TOKEN(HttpStatus.BAD_REQUEST, "The link is invalid or has expired!"),
    RATE_LIMITED(HttpStatus.TOO_MANY_REQUESTS, "Too many requests, please try again later!"),
    AI_USER_QUOTA_EXCEEDED(
            HttpStatus.TOO_MANY_REQUESTS, "You have reached your daily AI usage limit!"),
    AI_IP_QUOTA_EXCEEDED(
            HttpStatus.TOO_MANY_REQUESTS,
            "Too many AI requests from your network, please try again later!"),
    AI_NOT_CONFIGURED(HttpStatus.SERVICE_UNAVAILABLE, "The AI service is not available right now!"),
    AI_PROVIDER_BUSY(
            HttpStatus.SERVICE_UNAVAILABLE, "The AI service is busy, please try again later!"),
    AI_PROVIDER_TIMEOUT(HttpStatus.GATEWAY_TIMEOUT, "The AI service took too long to respond!"),
    AI_PROVIDER_ERROR(HttpStatus.BAD_GATEWAY, "The AI service returned an unexpected error!"),
    AI_REQUEST_REFUSED(
            HttpStatus.UNPROCESSABLE_CONTENT, "The AI service declined to process this request!"),
    AI_PROMPT_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "The AI prompt is not available!");

    private final HttpStatus status;
    private final String message;
}
