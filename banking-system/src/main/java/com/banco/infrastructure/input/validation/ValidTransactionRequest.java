package com.banco.infrastructure.input.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.TYPE;

@Documented
@Constraint(validatedBy = TransactionRequestValidator.class)
@Target({TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidTransactionRequest {

    String message() default "Datos de transacción inválidos";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
