package com.banco.infrastructure.input.controller;

import com.banco.application.exception.AccountNotFoundException;
import com.banco.domain.enums.AccountStatus;
import com.banco.domain.enums.AccountType;
import com.banco.domain.model.Account;
import com.banco.domain.model.Client;
import com.banco.domain.ports.in.AccountServicePort;
import com.banco.infrastructure.config.GlobalExceptionHandler;
import com.banco.infrastructure.input.dto.AccountRequest;
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

import java.math.BigDecimal;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = AccountController.class)
@ContextConfiguration(classes = com.banco.TestWebMvcConfig.class)
@Import({GlobalExceptionHandler.class, AccountControllerTest.TestExceptionHandler.class})
class AccountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AccountServicePort accountService;

    @Test
    void shouldCreateAccountSuccessfully() throws Exception {
        Account account = Account.builder()
                .id(1L)
                .accountNumber("ACC-001")
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("1000.00"))
                .client(Client.builder().id(10L).build())
                .build();

        when(accountService.create(any(Account.class))).thenReturn(account);

        AccountRequest request = AccountRequest.builder()
                .accountNumber("ACC-001")
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("1000.00"))
                .clientId(10L)
                .build();

        mockMvc.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.accountNumber").value("ACC-001"));
    }

    @Test
    void shouldReturnBadRequestWhenAccountPayloadIsInvalid() throws Exception {
        AccountRequest request = AccountRequest.builder()
                .accountNumber("")
                .accountType(null)
                .status(null)
                .balance(new BigDecimal("-10.00"))
                .clientId(null)
                .build();

        mockMvc.perform(post("/api/accounts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error de validación"));
    }

    @Test
    void shouldReturnAccountById() throws Exception {
        Account account = Account.builder()
                .id(1L)
                .accountNumber("ACC-001")
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("1000.00"))
                .build();

        when(accountService.findById(1L)).thenReturn(account);

        mockMvc.perform(get("/api/accounts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.accountNumber").value("ACC-001"));
    }

    @Test
    void shouldReturnNotFoundWhenAccountDoesNotExist() throws Exception {
        when(accountService.findById(99L)).thenThrow(new AccountNotFoundException("Account not found: 99"));

        mockMvc.perform(get("/api/accounts/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Account not found: 99"));
    }

    @Test
    void shouldReturnAllAccounts() throws Exception {
        when(accountService.findAll()).thenReturn(java.util.List.of(Account.builder().id(1L).accountNumber("ACC-001").build()));

        mockMvc.perform(get("/api/accounts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].accountNumber").value("ACC-001"));
    }

    @Test
    void shouldDeleteAccountSuccessfully() throws Exception {
        mockMvc.perform(delete("/api/accounts/1"))
                .andExpect(status().isNoContent());
    }

    @RestControllerAdvice
    static class TestExceptionHandler {
        @ExceptionHandler(AccountNotFoundException.class)
        public ResponseEntity<Map<String, Object>> handleNotFound(AccountNotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
        }
    }
}
