package com.banco.infrastructure.input.dto;

import com.banco.domain.enums.TransactionType;
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
public class TransactionResponse {

    private Long id;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDateTime transactionDate;
    private AccountReferenceResponse sourceAccount;
    private AccountReferenceResponse destinationAccount;
    private Boolean deleted;
}
