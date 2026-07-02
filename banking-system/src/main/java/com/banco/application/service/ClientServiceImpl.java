package com.banco.application.service;

import com.banco.application.exception.ClientNotFoundException;
import com.banco.domain.model.Client;
import com.banco.domain.ports.in.ClientServicePort;
import com.banco.domain.ports.out.ClientRepositoryPort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClientServiceImpl implements ClientServicePort {

    private final ClientRepositoryPort clientRepositoryPort;

    public ClientServiceImpl(ClientRepositoryPort clientRepositoryPort) {
        this.clientRepositoryPort = clientRepositoryPort;
    }

    @Override
    public Client create(Client client) {
        return clientRepositoryPort.save(client);
    }

    @Override
    public Client update(Long id, Client client) {
        Client existing = clientRepositoryPort.findById(id)
                .orElseThrow(() -> new ClientNotFoundException("Client not found: " + id));

        client.setId(id);
        client.setCreatedAt(existing.getCreatedAt());
        client.setUpdatedAt(LocalDateTime.now());

        return clientRepositoryPort.save(client);
    }

    @Override
    public Client findById(Long id) {
        return clientRepositoryPort.findById(id)
                .orElseThrow(() -> new ClientNotFoundException("Client not found: " + id));
    }

    @Override
    public List<Client> findAll() {
        return clientRepositoryPort.findAll();
    }

    @Override
    public void delete(Long id) {
        Client client = clientRepositoryPort.findById(id)
                .orElseThrow(() -> new ClientNotFoundException("Client not found: " + id));
        clientRepositoryPort.delete(client);
    }
}
