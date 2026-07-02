package com.banco.domain.ports.out;

import com.banco.domain.model.Client;

import java.util.List;
import java.util.Optional;

public interface ClientRepositoryPort {

    Client save(Client client);

    Optional<Client> findById(Long id);

    List<Client> findAll();

    void delete(Client client);
}