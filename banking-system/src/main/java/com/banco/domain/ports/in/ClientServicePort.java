package com.banco.domain.ports.in;

import com.banco.domain.model.Client;

import java.util.List;

public interface ClientServicePort {

    Client create(Client client);

    Client update(Long id, Client client);

    Client findById(Long id);

    List<Client> findAll();

    void delete(Long id);
}