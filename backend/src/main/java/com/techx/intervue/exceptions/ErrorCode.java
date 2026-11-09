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
    ADMIN_ACCESS_REQUIRED(
            HttpStatus.FORBIDDEN, "Access restricted to authorized administrators only."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "Resource not found!"),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "This method is not allowed here!"),
    UNSUPPORTED_MEDIA_TYPE(
            HttpStatus.UNSUPPORTED_MEDIA_TYPE, "This content type is not supported!"),
    INTERNAL_ERROR(
            HttpStatus.INTERNAL_SERVER_ERROR, "Something went wrong, please try again later!"),
    EMAIL_ALREADY_USED(HttpStatus.CONFLICT, "This email is already registered!"),
    EMAIL_ALREADY_VERIFIED(HttpStatus.CONFLICT, "Email is already verified!"),
    EMAIL_NOT_VERIFIED(
            HttpStatus.UNPROCESSABLE_CONTENT, "Please verify your email before continuing!"),
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
    AI_PROMPT_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "The AI prompt is not available!"),
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
    UNSUPPORTED_FILE_TYPE(HttpStatus.BAD_REQUEST, "This file type is not supported!"),
    FILE_TOO_LARGE(HttpStatus.BAD_REQUEST, "The file exceeds the allowed size!"),
    STORAGE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "File storage is not available right now!"),
    SMS_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "SMS delivery is not available right now!"),
    RECRUITER_NOT_AUTHORIZED_FOR_COMPANY(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "You need an approved authorization document for this company!"),
    VERIFICATION_INCOMPLETE(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "Finish the remaining verification steps before publishing jobs!"),
    ALREADY_COMPANY_MEMBER(HttpStatus.CONFLICT, "You already belong to this company!"),
    ALREADY_IN_ANOTHER_COMPANY(
            HttpStatus.CONFLICT,
            "You already belong to another company. Leave it before joining a new one!"),
    NOT_COMPANY_MEMBER(HttpStatus.FORBIDDEN, "You do not belong to this company!"),
    COMPANY_MEMBERSHIP_REVOKED(
            HttpStatus.FORBIDDEN, "Your membership of this company has been revoked!"),
    TAX_CODE_NOT_FOUND(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "We could not find this tax code in the national business registry!"),
    TAX_LOOKUP_BUSY(
            HttpStatus.TOO_MANY_REQUESTS,
            "The tax code lookup is busy, please try again in a moment!"),
    TAX_LOOKUP_UNAVAILABLE(
            HttpStatus.SERVICE_UNAVAILABLE,
            "The tax code lookup is not available right now, please try again later!"),
    COMPANY_LINK_UNDER_REVIEW(
            HttpStatus.CONFLICT,
            "Your documents are being reviewed. Wait for the result before leaving the company!"),
    COMPANY_PROFILE_INCOMPLETE(
            HttpStatus.UNPROCESSABLE_CONTENT, "Please complete the company profile first!"),
    DOCUMENT_ALREADY_UNDER_REVIEW(
            HttpStatus.CONFLICT, "A document of this type is already awaiting review!"),
    DOCUMENT_NOT_UNDER_REVIEW(
            HttpStatus.UNPROCESSABLE_CONTENT, "This document is not awaiting review!"),
    DOCUMENT_NOT_APPROVED(
            HttpStatus.UNPROCESSABLE_CONTENT, "Only an approved document can be revoked!"),
    DOCUMENT_EXPIRY_REQUIRED(
            HttpStatus.BAD_REQUEST, "An expiry date is required for a letter of authorization!"),
    PHONE_ALREADY_USED(HttpStatus.CONFLICT, "This phone number is already registered!"),
    PHONE_ALREADY_VERIFIED(HttpStatus.CONFLICT, "This phone number is already verified!"),
    PHONE_OTP_INVALID(HttpStatus.BAD_REQUEST, "The verification code is invalid or has expired!"),
    PHONE_OTP_NOT_REQUESTED(
            HttpStatus.UNPROCESSABLE_CONTENT, "Please request a verification code first!"),
    PHONE_OTP_ATTEMPTS_EXCEEDED(
            HttpStatus.BAD_REQUEST,
            "You have exceeded the maximum verification attempts. This code is now invalid. Please request a new one."),
    AGREEMENT_ALREADY_ACCEPTED(HttpStatus.CONFLICT, "This agreement has already been accepted!"),
    PROFILE_SECTION_LIMIT_REACHED(
            HttpStatus.CONFLICT, "You have reached the maximum number of items for this section!"),
    JOB_NOT_EDITABLE(
            HttpStatus.UNPROCESSABLE_CONTENT, "This job can no longer be edited or deleted!"),
    SAVED_LIMIT_REACHED(HttpStatus.CONFLICT, "You have reached the maximum number of saved items!"),
    ALREADY_APPLIED(HttpStatus.CONFLICT, "You have already applied to this job!"),
    JOB_NOT_OPEN(HttpStatus.UNPROCESSABLE_CONTENT, "This job is not accepting applications!"),
    CANNOT_APPLY_TO_OWN_COMPANY(
            HttpStatus.UNPROCESSABLE_CONTENT, "You cannot apply to a job of your own company!"),
    IDENTITY_NOT_VERIFIED(
            HttpStatus.UNPROCESSABLE_CONTENT, "Verify your identity before applying!"),
    IDENTITY_ALREADY_VERIFIED(HttpStatus.CONFLICT, "Your identity is already verified!"),
    IDENTITY_REVIEW_PENDING(
            HttpStatus.CONFLICT, "Your identity verification is already awaiting review!"),
    IDENTITY_ATTEMPTS_EXHAUSTED(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "You have used all identity verification attempts. Contact support for a manual review!"),
    IDENTITY_MANUAL_REVIEW_UNAVAILABLE(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "A manual review can only be requested after all attempts were rejected!"),
    IDENTITY_MANUAL_REVIEW_ALREADY_REQUESTED(
            HttpStatus.CONFLICT, "A manual review has already been requested!"),
    IDENTITY_UNDER_MINIMUM_AGE(
            HttpStatus.UNPROCESSABLE_CONTENT, "You must be at least 16 years old to verify!"),
    IDENTITY_NUMBER_ALREADY_USED(
            HttpStatus.CONFLICT, "This ID number is already verified on another account!"),
    RESUME_LIMIT_REACHED(HttpStatus.CONFLICT, "You have reached the maximum number of CVs!"),
    SCREENING_QUESTIONS_LOCKED(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "Screening questions cannot change once the job has applications!"),
    SKILL_NAME_ALREADY_USED(HttpStatus.CONFLICT, "A skill with this name already exists!"),
    INVALID_STATUS_TRANSITION(
            HttpStatus.UNPROCESSABLE_CONTENT, "This status change is not allowed!"),
    INTERVIEW_ALREADY_SCHEDULED(
            HttpStatus.CONFLICT, "This application already has an interview in progress!"),
    BLOG_POST_NOT_FOUND(HttpStatus.NOT_FOUND, "Blog post not found!"),
    BLOG_CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "Blog category not found!"),
    BLOG_SLUG_ALREADY_EXISTS(HttpStatus.CONFLICT, "A blog post with this slug already exists!"),
    BROADCAST_AUDIENCE_EMPTY(
            HttpStatus.UNPROCESSABLE_CONTENT, "This broadcast has no recipients to send to!"),
    OAUTH_STATE_INVALID(
            HttpStatus.BAD_REQUEST, "The sign-in request is invalid or has expired, please retry!"),
    OAUTH_NOT_CONFIGURED(
            HttpStatus.SERVICE_UNAVAILABLE, "This sign-in method is not available right now!"),
    OAUTH_PROVIDER_ERROR(
            HttpStatus.BAD_GATEWAY, "The sign-in provider returned an unexpected error!"),
    OAUTH_EMAIL_UNVERIFIED(
            HttpStatus.UNPROCESSABLE_CONTENT,
            "Your provider account has no verified email address!"),
    OAUTH_LINK_REQUIRES_VERIFIED_EMAIL(
            HttpStatus.CONFLICT,
            "An account with this email already exists. Sign in with your password and verify your email first, then you can use Google."),
    OAUTH_ACCOUNT_NOT_FOUND(
            HttpStatus.NOT_FOUND, "No account yet, sign up and accept the terms first!"),
    SOCIAL_LOGIN_NOT_ALLOWED(
            HttpStatus.FORBIDDEN, "This account cannot sign in with a social provider!"),
    PASSWORD_NOT_SET(HttpStatus.UNPROCESSABLE_CONTENT, "Set a password first!");

    private final HttpStatus status;
    private final String message;
}
