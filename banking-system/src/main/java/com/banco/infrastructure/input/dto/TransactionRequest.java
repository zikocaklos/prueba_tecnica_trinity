package com.banco.infrastructure.input.dto;

import com.banco.domain.enums.TransactionType;
import com.banco.infrastructure.input.validation.ValidTransactionRequest;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ValidTransactionRequest
public class TransactionRequest {

    @NotNull(message = "Tipo de transacción es requerido")
    private TransactionType type;

    @NotNull(message = "Monto es requerido")
    @DecimalMin(value = "0.01", message = "Monto debe ser mayor a 0")
    private BigDecimal amount;

    private Long sourceAccountId;

    private Long destinationAccountId;
}
