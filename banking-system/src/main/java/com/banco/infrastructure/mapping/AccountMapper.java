package com.banco.infrastructure.mapping;

import com.banco.domain.model.Account;
import com.banco.domain.model.Client;
import com.banco.infrastructure.input.dto.AccountRequest;
import com.banco.infrastructure.input.dto.AccountReferenceResponse;
import com.banco.infrastructure.input.dto.ClientRequest;
import com.banco.infrastructure.output.persistence.entity.AccountEntity;
import com.banco.infrastructure.output.persistence.entity.ClientEntity;

public final class AccountMapper {

    private AccountMapper() {
    }

    public static Account toDomain(AccountEntity entity) {
        if (entity == null) {
            return null;
        }

        return Account.builder()
                .id(entity.getId())
                .accountNumber(entity.getAccountNumber())
                .accountType(entity.getAccountType())
                .status(entity.getStatus())
                .balance(entity.getBalance())
                .exemptGmf(entity.getExemptGmf())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .client(entity.getClient() != null && entity.getClient().getId() != null
                    ? com.banco.domain.model.Client.builder().id(entity.getClient().getId()).build()
                    : null)
                .deleted(entity.getDeleted() != null ? entity.getDeleted() : false)
                .build();
    }

    public static AccountEntity toEntity(Account domain) {
        if (domain == null) {
            return null;
        }

        ClientEntity clientEntity = null;
        if (domain.getClient() != null && domain.getClient().getId() != null) {
            clientEntity = ClientEntity.builder().id(domain.getClient().getId()).build();
        }

        return AccountEntity.builder()
                .id(domain.getId())
                .accountNumber(domain.getAccountNumber())
                .accountType(domain.getAccountType())
                .status(domain.getStatus())
                .balance(domain.getBalance())
                .exemptGmf(domain.getExemptGmf())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .client(clientEntity)
                .deleted(domain.getDeleted())
                .build();
    }

    public static Account toDomain(AccountRequest request) {
        if (request == null) {
            return null;
        }

        return Account.builder()
                .id(request.getId())
                .accountNumber(request.getAccountNumber())
                .accountType(request.getAccountType())
                .status(request.getStatus())
                .balance(request.getBalance())
                .exemptGmf(request.getExemptGmf())
                .client(Client.builder().id(request.getClientId()).build())
                .build();
    }

    public static AccountReferenceResponse toReferenceResponse(Account domain) {
        if (domain == null) {
            return null;
        }

        return AccountReferenceResponse.builder()
                .id(domain.getId())
                .accountNumber(domain.getAccountNumber())
                .build();
    }

    public static com.banco.infrastructure.input.dto.AccountResponse toResponse(Account domain) {
        if (domain == null) {
            return null;
        }

        return com.banco.infrastructure.input.dto.AccountResponse.builder()
                .id(domain.getId())
                .accountNumber(domain.getAccountNumber())
                .accountType(domain.getAccountType())
                .status(domain.getStatus())
                .balance(domain.getBalance())
                .exemptGmf(domain.getExemptGmf())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .client(ClientMapper.toResponse(domain.getClient()))
                .deleted(domain.getDeleted())
                .build();
    }
}
