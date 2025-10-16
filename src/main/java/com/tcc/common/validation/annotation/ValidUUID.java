package com.tcc.common.validation.annotation;

import com.tcc.common.validation.UUIDValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = UUIDValidator.class)
@Target({ ElementType.PARAMETER, ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidUUID {
    String message() default "Invalid ID.";

    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
