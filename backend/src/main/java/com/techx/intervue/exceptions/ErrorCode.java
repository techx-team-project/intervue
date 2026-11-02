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
    ACCOUNT_BANNED(HttpStatus.FORBIDDEN, "This account has been banned!"),
    ACCOUNT_ALREADY_RESTRICTED(HttpStatus.CONFLICT, "This account is already banned!"),
    ACCOUNT_NOT_RESTRICTED(HttpStatus.CONFLICT, "This account has no restriction to lift!"),
    CANNOT_RESTRICT_SELF(HttpStatus.UNPROCESSABLE_CONTENT, "You cannot restrict your own account!"),
    LAST_ACTIVE_ADMIN(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "This is the last active admin account and must stay reachable!"),
    RATE_LIMITED(HttpStatus.TOO_MANY_REQUESTS, "Too many requests, please try again later!");

    private final HttpStatus status;
    private final String message;
}
