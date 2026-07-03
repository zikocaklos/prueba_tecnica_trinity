package com.banco.infrastructure.input.validation;

import com.banco.domain.enums.TransactionType;
import com.banco.infrastructure.input.dto.TransactionRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TransactionRequestValidator implements ConstraintValidator<ValidTransactionRequest, TransactionRequest> {

    @Override
    public boolean isValid(TransactionRequest request, ConstraintValidatorContext context) {
        if (request == null) {
            return true;
        }

        context.disableDefaultConstraintViolation();
        boolean valid = true;

        if (request.getType() == TransactionType.DEPOSIT) {
            if (request.getDestinationAccountId() == null) {
                context.buildConstraintViolationWithTemplate("Cuenta destino es requerida para consignación")
                        .addPropertyNode("destinationAccountId")
                        .addConstraintViolation();
                valid = false;
            }
        }

        if (request.getType() == TransactionType.WITHDRAWAL) {
            if (request.getSourceAccountId() == null) {
                context.buildConstraintViolationWithTemplate("Cuenta origen es requerida para retiro")
                        .addPropertyNode("sourceAccountId")
                        .addConstraintViolation();
                valid = false;
            }
        }

        if (request.getType() == TransactionType.TRANSFER) {
            if (request.getSourceAccountId() == null) {
                context.buildConstraintViolationWithTemplate("Cuenta origen es requerida para transferencia")
                        .addPropertyNode("sourceAccountId")
                        .addConstraintViolation();
                valid = false;
            }
            if (request.getDestinationAccountId() == null) {
                context.buildConstraintViolationWithTemplate("Cuenta destino es requerida para transferencia")
                        .addPropertyNode("destinationAccountId")
                        .addConstraintViolation();
                valid = false;
            }
            if (request.getSourceAccountId() != null && request.getSourceAccountId().equals(request.getDestinationAccountId())) {
                context.buildConstraintViolationWithTemplate("Cuenta destino debe ser diferente a la cuenta origen")
                        .addPropertyNode("destinationAccountId")
                        .addConstraintViolation();
                valid = false;
            }
        }

        return valid;
    }
}
