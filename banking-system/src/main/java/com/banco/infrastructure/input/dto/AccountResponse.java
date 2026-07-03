package com.banco.infrastructure.input.dto;

import com.banco.domain.enums.AccountStatus;
import com.banco.domain.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountResponse {

    private Long id;
    private String accountNumber;
    private AccountType accountType;
    private AccountStatus status;
    private BigDecimal balance;
    private Boolean exemptGmf;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ClientResponse client;
    private Boolean deleted;
}
