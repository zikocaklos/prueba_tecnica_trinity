package com.banco.infrastructure.mapping;

import com.banco.domain.model.Account;
import com.banco.domain.model.Transaction;
import com.banco.infrastructure.input.dto.AccountReferenceResponse;
import com.banco.infrastructure.input.dto.TransactionRequest;
import com.banco.infrastructure.input.dto.TransactionResponse;
import com.banco.infrastructure.output.persistence.entity.AccountEntity;
import com.banco.infrastructure.output.persistence.entity.TransactionEntity;

public final class TransactionMapper {

    private TransactionMapper() {
    }

    public static Transaction toDomain(TransactionEntity entity) {
        if (entity == null) {
            return null;
        }

        Account sourceAccount = null;
        if (entity.getSourceAccount() != null) {
            sourceAccount = Account.builder()
                .id(entity.getSourceAccount().getId())
                .build();
        }

        Account destinationAccount = null;
        if (entity.getDestinationAccount() != null) {
            destinationAccount = Account.builder()
                .id(entity.getDestinationAccount().getId())
                .build();
        }

        return Transaction.builder()
                .id(entity.getId())
                .type(entity.getType())
                .amount(entity.getAmount())
                .transactionDate(entity.getTransactionDate())
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .deleted(entity.getDeleted() != null ? entity.getDeleted() : false)
                .build();
    }

    public static TransactionEntity toEntity(Transaction domain) {
        if (domain == null) {
            return null;
        }

        AccountEntity sourceEntity = null;
        if (domain.getSourceAccount() != null && domain.getSourceAccount().getId() != null) {
            sourceEntity = AccountEntity.builder().id(domain.getSourceAccount().getId()).build();
        }

        AccountEntity destinationEntity = null;
        if (domain.getDestinationAccount() != null && domain.getDestinationAccount().getId() != null) {
            destinationEntity = AccountEntity.builder().id(domain.getDestinationAccount().getId()).build();
        }

        return TransactionEntity.builder()
                .id(domain.getId())
                .type(domain.getType())
                .amount(domain.getAmount())
                .transactionDate(domain.getTransactionDate())
                .sourceAccount(sourceEntity)
                .destinationAccount(destinationEntity)
                .deleted(domain.getDeleted())
                .build();
    }

    public static Transaction toDomain(TransactionRequest request) {
        if (request == null) {
            return null;
        }

        Account sourceAccount = null;
        if (request.getSourceAccountId() != null) {
            sourceAccount = Account.builder().id(request.getSourceAccountId()).build();
        }

        Account destinationAccount = null;
        if (request.getDestinationAccountId() != null) {
            destinationAccount = Account.builder().id(request.getDestinationAccountId()).build();
        }

        return Transaction.builder()
                .type(request.getType())
                .amount(request.getAmount())
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .build();
    }

    public static TransactionResponse toResponse(Transaction domain) {
        if (domain == null) {
            return null;
        }

        AccountReferenceResponse source = null;
        if (domain.getSourceAccount() != null) {
            source = AccountReferenceResponse.builder()
                    .id(domain.getSourceAccount().getId())
                    .accountNumber(domain.getSourceAccount().getAccountNumber())
                    .build();
        }

        AccountReferenceResponse destination = null;
        if (domain.getDestinationAccount() != null) {
            destination = AccountReferenceResponse.builder()
                    .id(domain.getDestinationAccount().getId())
                    .accountNumber(domain.getDestinationAccount().getAccountNumber())
                    .build();
        }

        return TransactionResponse.builder()
                .id(domain.getId())
                .type(domain.getType())
                .amount(domain.getAmount())
                .transactionDate(domain.getTransactionDate())
                .sourceAccount(source)
                .destinationAccount(destination)
                .deleted(domain.getDeleted())
                .build();
    }
}
