package com.banco.application.service;

import com.banco.application.exception.ClientNotFoundException;
import com.banco.domain.model.Client;
import com.banco.domain.ports.out.ClientRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private ClientRepositoryPort clientRepositoryPort;

    @InjectMocks
    private ClientServiceImpl clientService;

    private Client client;

    @BeforeEach
    void setUp() {
        client = Client.builder()
                .id(1L)
                .identificationType("CC")
                .identificationNumber("123456789")
                .firstName("Ana")
                .lastName("García")
                .email("ana@test.com")
                .birthDate(LocalDate.of(1995, 1, 1))
                .createdAt(LocalDateTime.now())
                .deleted(false)
                .build();
    }

    @Test
    void shouldCreateClientSuccessfully() {
        when(clientRepositoryPort.save(any(Client.class))).thenReturn(client);

        Client created = clientService.create(client);

        assertNotNull(created);
        assertEquals(client.getId(), created.getId());
        assertEquals("Ana", created.getFirstName());
        verify(clientRepositoryPort, times(1)).save(client);
    }

    @Test
    void shouldFindClientByIdSuccessfully() {
        when(clientRepositoryPort.findById(1L)).thenReturn(Optional.of(client));

        Client found = clientService.findById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
        verify(clientRepositoryPort).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenClientDoesNotExistOnFindById() {
        when(clientRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        ClientNotFoundException exception = assertThrows(ClientNotFoundException.class, () -> clientService.findById(99L));

        assertEquals("Client not found: 99", exception.getMessage());
        verify(clientRepositoryPort).findById(99L);
    }

    @Test
    void shouldReturnAllClients() {
        List<Client> clients = List.of(client, Client.builder().id(2L).firstName("Luis").lastName("Pérez").build());
        when(clientRepositoryPort.findAll()).thenReturn(clients);

        List<Client> result = clientService.findAll();

        assertEquals(2, result.size());
        assertEquals("Ana", result.get(0).getFirstName());
        verify(clientRepositoryPort).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenNoClientsExist() {
        when(clientRepositoryPort.findAll()).thenReturn(List.of());

        List<Client> result = clientService.findAll();

        assertTrue(result.isEmpty());
        verify(clientRepositoryPort).findAll();
    }

    @Test
    void shouldUpdateClientSuccessfully() {
        Client updatedClient = Client.builder()
                .id(1L)
                .identificationType("TI")
                .identificationNumber("987654321")
                .firstName("Ana María")
                .lastName("García")
                .email("ana.maria@test.com")
                .birthDate(LocalDate.of(1994, 2, 2))
                .build();

        when(clientRepositoryPort.findById(1L)).thenReturn(Optional.of(client));
        when(clientRepositoryPort.save(any(Client.class))).thenReturn(updatedClient);

        Client result = clientService.update(1L, updatedClient);

        ArgumentCaptor<Client> captor = ArgumentCaptor.forClass(Client.class);
        verify(clientRepositoryPort).save(captor.capture());

        assertEquals(1L, result.getId());
        assertEquals(1L, captor.getValue().getId());
        assertNotNull(captor.getValue().getUpdatedAt());
        assertEquals("Ana María", result.getFirstName());
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonexistentClient() {
        when(clientRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        ClientNotFoundException exception = assertThrows(ClientNotFoundException.class, () -> clientService.update(99L, client));

        assertEquals("Client not found: 99", exception.getMessage());
        verify(clientRepositoryPort, never()).save(any(Client.class));
    }

    @Test
    void shouldPropagateExceptionWhenRepositoryThrowsDuringUpdate() {
        when(clientRepositoryPort.findById(1L)).thenReturn(Optional.of(client));
        when(clientRepositoryPort.save(any(Client.class))).thenThrow(new RuntimeException("db error"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> clientService.update(1L, client));

        assertEquals("db error", exception.getMessage());
    }

    @Test
    void shouldDeleteClientSuccessfully() {
        when(clientRepositoryPort.findById(1L)).thenReturn(Optional.of(client));
        doNothing().when(clientRepositoryPort).delete(client);

        clientService.delete(1L);

        verify(clientRepositoryPort).findById(1L);
        verify(clientRepositoryPort).delete(client);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonexistentClient() {
        when(clientRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        ClientNotFoundException exception = assertThrows(ClientNotFoundException.class, () -> clientService.delete(99L));

        assertEquals("Client not found: 99", exception.getMessage());
        verify(clientRepositoryPort).findById(99L);
        verify(clientRepositoryPort, never()).delete(any(Client.class));
    }
}
