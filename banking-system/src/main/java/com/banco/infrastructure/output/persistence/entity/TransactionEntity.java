package com.banco.infrastructure.output.persistence.entity;

import com.banco.domain.enums.TransactionType;
import com.banco.domain.model.Transaction;
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
@Table(name = "transactions")
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private BigDecimal amount;

    private LocalDateTime transactionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_account_id")
    private AccountEntity sourceAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_account_id")
    private AccountEntity destinationAccount;

    private Boolean deleted;

    public Transaction toModel() {
        return Transaction.builder()
                .id(id)
                .type(type)
                .amount(amount)
                .transactionDate(transactionDate)
                .sourceAccount(sourceAccount != null ? sourceAccount.toModel() : null)
                .destinationAccount(destinationAccount != null ? destinationAccount.toModel() : null)
                .deleted(deleted != null ? deleted : false)
                .build();
    }

    public static TransactionEntity fromModel(Transaction t) {
        return TransactionEntity.builder()
                .id(t.getId())
                .type(t.getType())
                .amount(t.getAmount())
                .transactionDate(t.getTransactionDate())
                .sourceAccount(t.getSourceAccount() != null ? AccountEntity.fromModel(t.getSourceAccount()) : null)
                .destinationAccount(t.getDestinationAccount() != null ? AccountEntity.fromModel(t.getDestinationAccount()) : null)
                .deleted(t.getDeleted())
                .build();
    }
}
