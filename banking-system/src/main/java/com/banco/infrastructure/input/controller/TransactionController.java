package com.banco.infrastructure.input.controller;

import com.banco.domain.model.Transaction;
import com.banco.domain.ports.in.TransactionServicePort;
import com.banco.infrastructure.input.dto.TransactionRequest;
import com.banco.infrastructure.input.dto.TransactionResponse;
import com.banco.infrastructure.mapping.TransactionMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionServicePort transactionService;

    public TransactionController(TransactionServicePort transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody @Valid TransactionRequest transactionRequest) {
        Transaction transaction = TransactionMapper.toDomain(transactionRequest);
        Transaction created = transactionService.create(transaction);
        TransactionResponse response = TransactionMapper.toResponse(created);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable Long id) {
        Transaction transaction = transactionService.findById(id);
        return ResponseEntity.ok(TransactionMapper.toResponse(transaction));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        List<TransactionResponse> response = transactionService.findAll().stream()
                .map(TransactionMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}

