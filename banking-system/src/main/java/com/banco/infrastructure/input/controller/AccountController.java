package com.banco.infrastructure.input.controller;

import com.banco.domain.model.Account;
import com.banco.domain.ports.in.AccountServicePort;
import com.banco.infrastructure.input.dto.AccountRequest;
import com.banco.infrastructure.input.dto.AccountResponse;
import com.banco.infrastructure.mapping.AccountMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountServicePort accountService;

    public AccountController(AccountServicePort accountService) {
        this.accountService = accountService;
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@RequestBody @Valid AccountRequest accountRequest) {
        Account created = accountService.create(AccountMapper.toDomain(accountRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(AccountMapper.toResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountResponse> updateAccount(@PathVariable Long id, @RequestBody @Valid AccountRequest accountRequest) {
        Account updated = accountService.update(id, AccountMapper.toDomain(accountRequest));
        return ResponseEntity.ok(AccountMapper.toResponse(updated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable Long id) {
        return ResponseEntity.ok(AccountMapper.toResponse(accountService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        List<AccountResponse> response = accountService.findAll().stream()
                .map(AccountMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
