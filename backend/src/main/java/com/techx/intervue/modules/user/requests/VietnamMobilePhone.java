package com.techx.intervue.modules.user.requests;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.ReportAsSingleViolation;
import jakarta.validation.constraints.Pattern;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = {})
@ReportAsSingleViolation
@Pattern(regexp = "^0[35789]\\d{8}$")
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface VietnamMobilePhone {
    String message() default
            "Enter a personal Vietnamese mobile number: 10 digits starting with 03, 05, 07, 08 or 09!";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
