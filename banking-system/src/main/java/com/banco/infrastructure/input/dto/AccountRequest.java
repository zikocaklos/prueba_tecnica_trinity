package com.banco.infrastructure.input.dto;

import com.banco.domain.enums.AccountStatus;
import com.banco.domain.enums.AccountType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
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
public class AccountRequest {

    private Long id;

    @NotBlank(message = "Número de cuenta es requerido")
    private String accountNumber;

    @NotNull(message = "Tipo de cuenta es requerido")
    private AccountType accountType;

    @NotNull(message = "Estado de cuenta es requerido")
    private AccountStatus status;

    @NotNull(message = "Balance es requerido")
    @DecimalMin(value = "0.0", message = "Balance no puede ser negativo")
    private BigDecimal balance;

    private Boolean exemptGmf;

    @NotNull(message = "Cliente es requerido")
    private Long clientId;
}
