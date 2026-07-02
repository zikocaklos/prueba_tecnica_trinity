package com.banco.infrastructure.output.persistence.entity;

import com.banco.domain.model.Account;
import com.banco.domain.enums.AccountStatus;
import com.banco.domain.enums.AccountType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "accounts")
public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    private BigDecimal balance;

    private Boolean exemptGmf;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Boolean deleted;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private ClientEntity client;

    public Account toModel() {
        return Account.builder()
                .id(id)
                .accountNumber(accountNumber)
                .accountType(accountType)
                .status(status)
                .balance(balance)
                .exemptGmf(exemptGmf)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .client(client != null ? client.toModel() : null)
                .deleted(deleted != null ? deleted : false)
                .build();
    }

    public static AccountEntity fromModel(Account account) {
        return AccountEntity.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType())
                .status(account.getStatus())
                .balance(account.getBalance())
                .exemptGmf(account.getExemptGmf())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .client(account.getClient() != null ? ClientEntity.fromModel(account.getClient()) : null)
                .deleted(account.getDeleted())
                .build();
    }
}
