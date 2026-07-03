package com.banco.infrastructure.input.controller;

import com.banco.domain.model.Client;
import com.banco.domain.ports.in.ClientServicePort;
import com.banco.infrastructure.input.dto.ClientRequest;
import com.banco.infrastructure.input.dto.ClientResponse;
import com.banco.infrastructure.mapping.ClientMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    private final ClientServicePort clientService;

    public ClientController(ClientServicePort clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    public ResponseEntity<ClientResponse> createClient(@RequestBody @Valid ClientRequest clientRequest) {
        Client created = clientService.create(ClientMapper.toDomain(clientRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(ClientMapper.toResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable Long id,
            @RequestBody @Valid ClientRequest clientRequest) {
        Client updated = clientService.update(id, ClientMapper.toDomain(clientRequest));
        return ResponseEntity.ok(ClientMapper.toResponse(updated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponse> getClient(@PathVariable Long id) {
        return ResponseEntity.ok(ClientMapper.toResponse(clientService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<ClientResponse>> getAllClients() {
        List<ClientResponse> response = clientService.findAll().stream()
                .map(ClientMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
