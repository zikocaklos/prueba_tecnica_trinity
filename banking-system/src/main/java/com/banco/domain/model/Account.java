package com.banco.domain.model;

import com.banco.domain.enums.AccountStatus;
import com.banco.domain.enums.AccountType;
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
public class Account {

    private Long id;

    @NotNull(message = "Número de cuenta es requerido")
    private String accountNumber;

    @NotNull(message = "Tipo de cuenta es requerido")
    private AccountType accountType;

    @NotNull(message = "Estado de cuenta es requerido")
    private AccountStatus status;

    @NotNull(message = "Balance es requerido")
    @DecimalMin(value = "0.0", message = "Balance no puede ser negativo")
    private BigDecimal balance;

    private Boolean exemptGmf;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @NotNull(message = "Cliente es requerido")
    private Client client;

    private Boolean deleted;
}