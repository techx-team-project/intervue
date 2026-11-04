package com.techx.intervue.exceptions;

import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.ErrorResource;
import com.techx.intervue.resources.FieldErrorResource;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResource<Void>> handleApp(AppException ex) {
        ErrorResource error =
                ErrorResource.builder()
                        .code(ex.getErrorCode().name())
                        .details(ex.getDetails())
                        .meta(ex.getMeta())
                        .build();
        ResponseEntity.BodyBuilder response = ResponseEntity.status(ex.getErrorCode().getStatus());
        if (ex.getRetryAfterSeconds() != null) {
            response.header(HttpHeaders.RETRY_AFTER, String.valueOf(ex.getRetryAfterSeconds()));
        }
        return response.body(ApiResource.error(error, ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResource<Void>> handleValidation(MethodArgumentNotValidException ex) {
        List<FieldErrorResource> details =
                ex.getBindingResult().getFieldErrors().stream()
                        .map(
                                f ->
                                        FieldErrorResource.builder()
                                                .field(f.getField())
                                                .message(f.getDefaultMessage())
                                                .build())
                        .toList();
        return build(ErrorCode.VALIDATION_FAILED, details);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResource<Void>> handleUnreadable() {
        return build(ErrorCode.VALIDATION_FAILED, List.of());
    }

    @ExceptionHandler({EntityNotFoundException.class, NoResourceFoundException.class})
    public ResponseEntity<ApiResource<Void>> handleNotFound() {
        return build(ErrorCode.NOT_FOUND, List.of());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResource<Void>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex) {
        FieldErrorResource detail =
                FieldErrorResource.builder()
                        .field(ex.getName())
                        .message("The value is not one of the accepted values")
                        .build();
        return build(ErrorCode.VALIDATION_FAILED, List.of(detail));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResource<Void>> handleUploadTooLarge() {
        return build(ErrorCode.FILE_TOO_LARGE, List.of());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResource<Void>> handleForbidden() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean anonymous =
                authentication == null || authentication instanceof AnonymousAuthenticationToken;
        return build(anonymous ? ErrorCode.UNAUTHENTICATED : ErrorCode.FORBIDDEN, List.of());
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResource<Void>> handleUnauthenticated() {
        return build(ErrorCode.UNAUTHENTICATED, List.of());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResource<Void>> handleMethodNotAllowed() {
        return build(ErrorCode.METHOD_NOT_ALLOWED, List.of());
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResource<Void>> handleUnsupportedMediaType() {
        return build(ErrorCode.UNSUPPORTED_MEDIA_TYPE, List.of());
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ApiResource<Void>> handleMissingPart(
            MissingServletRequestPartException ex) {
        return missingInput(ex.getRequestPartName());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResource<Void>> handleMissingParameter(
            MissingServletRequestParameterException ex) {
        return missingInput(ex.getParameterName());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResource<Void>> handleUnexpected(Exception ex) {
        log.error("Unhandled exception", ex);
        return build(ErrorCode.INTERNAL_ERROR, List.of());
    }

    private ResponseEntity<ApiResource<Void>> missingInput(String name) {
        FieldErrorResource detail =
                FieldErrorResource.builder().field(name).message("This field is required").build();
        return build(ErrorCode.VALIDATION_FAILED, List.of(detail));
    }

    private ResponseEntity<ApiResource<Void>> build(
            ErrorCode code, List<FieldErrorResource> details) {
        ErrorResource error =
                ErrorResource.builder().code(code.name()).details(details).meta(Map.of()).build();
        return ResponseEntity.status(code.getStatus())
                .body(ApiResource.error(error, code.getMessage()));
    }
}
