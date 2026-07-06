package com.banco.infrastructure.input.controller;

import com.banco.application.exception.ClientNotFoundException;
import com.banco.domain.model.Client;
import com.banco.domain.ports.in.ClientServicePort;
import com.banco.infrastructure.config.GlobalExceptionHandler;
import com.banco.infrastructure.input.dto.ClientRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDate;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = ClientController.class)
@ContextConfiguration(classes = com.banco.TestWebMvcConfig.class)
@Import({GlobalExceptionHandler.class, ClientControllerTest.TestExceptionHandler.class})
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ClientServicePort clientService;

    @Test
    void shouldCreateClientSuccessfully() throws Exception {
        Client client = Client.builder()
                .id(1L)
                .identificationType("CC")
                .identificationNumber("123456789")
                .firstName("Ana")
                .lastName("García")
                .email("ana@test.com")
                .birthDate(LocalDate.of(1995, 1, 1))
                .build();

        when(clientService.create(any(Client.class))).thenReturn(client);

        ClientRequest request = ClientRequest.builder()
                .identificationType("CC")
                .identificationNumber("123456789")
                .firstName("Ana")
                .lastName("García")
                .email("ana@test.com")
                .birthDate(LocalDate.of(1995, 1, 1))
                .build();

        mockMvc.perform(post("/api/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Ana"));
    }

    @Test
    void shouldReturnBadRequestWhenClientPayloadIsInvalid() throws Exception {
        ClientRequest request = ClientRequest.builder()
                .identificationType("")
                .identificationNumber("")
                .firstName("A")
                .lastName("")
                .email("not-an-email")
                .birthDate(null)
                .build();

        mockMvc.perform(post("/api/clients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error de validación"))
                .andExpect(jsonPath("$.errors.firstName").value("Nombre debe tener al menos 2 caracteres"))
                .andExpect(jsonPath("$.errors.email").value("Email debe ser válido"));
    }

    @Test
    void shouldReturnClientById() throws Exception {
        Client client = Client.builder()
                .id(1L)
                .firstName("Ana")
                .lastName("García")
                .email("ana@test.com")
                .birthDate(LocalDate.of(1995, 1, 1))
                .build();

        when(clientService.findById(1L)).thenReturn(client);

        mockMvc.perform(get("/api/clients/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("Ana"));
    }

    @Test
    void shouldReturnNotFoundWhenClientDoesNotExist() throws Exception {
        when(clientService.findById(99L)).thenThrow(new ClientNotFoundException("Client not found: 99"));

        mockMvc.perform(get("/api/clients/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Client not found: 99"));
    }

    @Test
    void shouldReturnAllClients() throws Exception {
        when(clientService.findAll()).thenReturn(java.util.List.of(Client.builder().id(1L).firstName("Ana").lastName("García").build()));

        mockMvc.perform(get("/api/clients"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].firstName").value("Ana"));
    }

    @Test
    void shouldDeleteClientSuccessfully() throws Exception {
        mockMvc.perform(delete("/api/clients/1"))
                .andExpect(status().isNoContent());
    }

    @RestControllerAdvice
    static class TestExceptionHandler {
        @ExceptionHandler(ClientNotFoundException.class)
        public ResponseEntity<Map<String, Object>> handleNotFound(ClientNotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
        }
    }
}
