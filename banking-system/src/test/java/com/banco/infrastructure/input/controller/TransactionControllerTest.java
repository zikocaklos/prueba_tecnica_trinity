package com.banco.infrastructure.input.controller;

import com.banco.application.exception.TransactionNotFoundException;
import com.banco.domain.enums.TransactionType;
import com.banco.domain.model.Transaction;
import com.banco.domain.ports.in.TransactionServicePort;
import com.banco.infrastructure.config.GlobalExceptionHandler;
import com.banco.infrastructure.input.dto.TransactionRequest;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = TransactionController.class)
@ContextConfiguration(classes = com.banco.TestWebMvcConfig.class)
@Import({GlobalExceptionHandler.class, TransactionControllerTest.TestExceptionHandler.class})
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TransactionServicePort transactionService;

    @Test
    void shouldCreateTransactionSuccessfully() throws Exception {
        Transaction transaction = Transaction.builder()
                .id(1L)
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("100.00"))
                .build();

        when(transactionService.create(any(Transaction.class))).thenReturn(transaction);

        TransactionRequest request = TransactionRequest.builder()
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("100.00"))
                .destinationAccountId(2L)
                .build();

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.type").value("DEPOSIT"));
    }

    @Test
    void shouldReturnBadRequestWhenTransactionPayloadIsInvalid() throws Exception {
        TransactionRequest request = TransactionRequest.builder()
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("0.00"))
                .destinationAccountId(null)
                .build();

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error de validación"));
    }

    @Test
    void shouldReturnTransactionById() throws Exception {
        Transaction transaction = Transaction.builder()
                .id(1L)
                .type(TransactionType.WITHDRAWAL)
                .amount(new BigDecimal("50.00"))
                .build();

        when(transactionService.findById(1L)).thenReturn(transaction);

        mockMvc.perform(get("/api/transactions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldReturnNotFoundWhenTransactionDoesNotExist() throws Exception {
        when(transactionService.findById(99L)).thenThrow(new TransactionNotFoundException("Transaction not found: 99"));

        mockMvc.perform(get("/api/transactions/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Transaction not found: 99"));
    }

    @Test
    void shouldReturnAllTransactions() throws Exception {
        when(transactionService.findAll()).thenReturn(java.util.List.of(Transaction.builder().id(1L).type(TransactionType.DEPOSIT).amount(new BigDecimal("100.00")).build()));

        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @RestControllerAdvice
    static class TestExceptionHandler {
        @ExceptionHandler(TransactionNotFoundException.class)
        public ResponseEntity<Map<String, Object>> handleNotFound(TransactionNotFoundException ex) {
            return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
        }
    }
}
