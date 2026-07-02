package com.banco.domain.model;

import com.banco.domain.enums.TransactionType;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    private Long id;

    @NotNull(message = "Tipo de transacción es requerido")
    private TransactionType type;

    @NotNull(message = "Monto es requerido")
    @DecimalMin(value = "0.01", message = "Monto debe ser mayor a 0")
    private BigDecimal amount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime transactionDate;

    @NotNull(message = "Cuenta de origen es requerida")
    private Account sourceAccount;

    private Account destinationAccount;

    private Boolean deleted;
}