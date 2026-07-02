package com.banco.infrastructure.output.persistence.adapter;

import com.banco.domain.model.Client;
import com.banco.domain.ports.out.ClientRepositoryPort;
import com.banco.infrastructure.output.persistence.entity.ClientEntity;
import com.banco.infrastructure.output.persistence.repository.SpringClientRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ClientRepositoryAdapter implements ClientRepositoryPort {

    private final SpringClientRepository clientRepository;

    public ClientRepositoryAdapter(SpringClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    public Client save(Client client) {
        LocalDateTime now = LocalDateTime.now();
        ClientEntity entity = ClientEntity.fromModel(client);

        if (entity.getId() == null) {
            entity.setCreatedAt(now);
        } else {
            entity.setUpdatedAt(now);
        }

        ClientEntity saved = clientRepository.save(entity);
        return saved.toModel();
    }

    @Override
    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id)
                .filter(entity -> entity.getDeleted() == null || !entity.getDeleted())
                .map(ClientEntity::toModel);
    }

    @Override
    public List<Client> findAll() {
        return clientRepository.findAll().stream()
                .filter(entity -> entity.getDeleted() == null || !entity.getDeleted())
                .map(ClientEntity::toModel)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Client client) {
        if (client == null || client.getId() == null) {
            throw new IllegalArgumentException("Client id is required for delete");
        }
        client.setDeleted(true);
        clientRepository.save(ClientEntity.fromModel(client));
    }
}
