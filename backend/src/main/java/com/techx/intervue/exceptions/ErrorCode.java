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
    EMAIL_NOT_VERIFIED(
            HttpStatus.UNPROCESSABLE_CONTENT, "Please verify your email before continuing!"),
    INVALID_OR_EXPIRED_TOKEN(HttpStatus.BAD_REQUEST, "The link is invalid or has expired!"),
    ACCOUNT_BANNED(HttpStatus.FORBIDDEN, "This account has been banned!"),
    ACCOUNT_ALREADY_RESTRICTED(HttpStatus.CONFLICT, "This account is already banned!"),
    ACCOUNT_NOT_RESTRICTED(HttpStatus.CONFLICT, "This account has no restriction to lift!"),
    CANNOT_RESTRICT_SELF(HttpStatus.UNPROCESSABLE_CONTENT, "You cannot restrict your own account!"),
    LAST_ACTIVE_ADMIN(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "This is the last active admin account and must stay reachable!"),
    ROLE_ALREADY_GRANTED(HttpStatus.CONFLICT, "User already has this role!"),
    ROLE_NOT_ASSIGNED(HttpStatus.UNPROCESSABLE_CONTENT, "User does not have this role assigned!"),
    CANNOT_REMOVE_SELF_ADMIN(
            HttpStatus.UNPROCESSABLE_CONTENT, "You cannot remove your own admin role!"),
    CANNOT_REMOVE_LAST_ROLE(
            HttpStatus.UNPROCESSABLE_CONTENT, "A user must retain at least one role!"),
    ACCOUNT_DELETED(HttpStatus.FORBIDDEN, "This account has been deleted!"),
    ACCOUNT_NOT_PENDING_DELETION(
            HttpStatus.UNPROCESSABLE_CONTENT, "This account is not pending deletion!"),
    DELETION_BLOCKED(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "Account cannot be deleted while unresolved operations remain!"),
    RATE_LIMITED(HttpStatus.TOO_MANY_REQUESTS, "Too many requests, please try again later!");

    private final HttpStatus status;
    private final String message;
}
