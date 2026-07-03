package com.banco.infrastructure.mapping;

import com.banco.domain.model.Client;
import com.banco.infrastructure.input.dto.ClientRequest;
import com.banco.infrastructure.output.persistence.entity.ClientEntity;

public final class ClientMapper {

    private ClientMapper() {
    }

    public static Client toDomain(ClientEntity entity) {
        if (entity == null) {
            return null;
        }

        return Client.builder()
                .id(entity.getId())
                .identificationType(entity.getIdentificationType())
                .identificationNumber(entity.getIdentificationNumber())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .email(entity.getEmail())
                .birthDate(entity.getBirthDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .deleted(entity.getDeleted() != null ? entity.getDeleted() : false)
                .build();
    }

    public static ClientEntity toEntity(Client domain) {
        if (domain == null) {
            return null;
        }

        return ClientEntity.builder()
                .id(domain.getId())
                .identificationType(domain.getIdentificationType())
                .identificationNumber(domain.getIdentificationNumber())
                .firstName(domain.getFirstName())
                .lastName(domain.getLastName())
                .email(domain.getEmail())
                .birthDate(domain.getBirthDate())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .deleted(domain.getDeleted())
                .build();
    }

    public static Client toDomain(ClientRequest request) {
        if (request == null) {
            return null;
        }

        return Client.builder()
                .id(request.getId())
                .identificationType(request.getIdentificationType())
                .identificationNumber(request.getIdentificationNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .birthDate(request.getBirthDate())
                .build();
    }

    public static com.banco.infrastructure.input.dto.ClientResponse toResponse(Client domain) {
        if (domain == null) {
            return null;
        }

        return com.banco.infrastructure.input.dto.ClientResponse.builder()
                .id(domain.getId())
                .identificationType(domain.getIdentificationType())
                .identificationNumber(domain.getIdentificationNumber())
                .firstName(domain.getFirstName())
                .lastName(domain.getLastName())
                .email(domain.getEmail())
                .birthDate(domain.getBirthDate())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .deleted(domain.getDeleted())
                .build();
    }
}
