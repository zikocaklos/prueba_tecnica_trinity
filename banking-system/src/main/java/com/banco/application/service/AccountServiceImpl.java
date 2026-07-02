package com.banco.application.service;

import com.banco.application.exception.AccountNotFoundException;
import com.banco.application.exception.ClientNotFoundException;
import com.banco.domain.model.Account;
import com.banco.domain.model.Client;
import com.banco.domain.ports.in.AccountServicePort;
import com.banco.domain.ports.out.AccountRepositoryPort;
import com.banco.domain.ports.out.ClientRepositoryPort;
import com.banco.domain.ports.out.TransactionRepositoryPort;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AccountServiceImpl implements AccountServicePort {

    private final AccountRepositoryPort accountRepositoryPort;
    private final ClientRepositoryPort clientRepositoryPort;
    private final TransactionRepositoryPort transactionRepositoryPort;

    public AccountServiceImpl(AccountRepositoryPort accountRepositoryPort, ClientRepositoryPort clientRepositoryPort, TransactionRepositoryPort transactionRepositoryPort) {
        this.accountRepositoryPort = accountRepositoryPort;
        this.clientRepositoryPort = clientRepositoryPort;
        this.transactionRepositoryPort = transactionRepositoryPort;
    }

    @Override
    public Account create(Account account) {
        Client client = account.getClient();
        if (client == null || client.getId() == null) {
            throw new ClientNotFoundException("Client id required to create account");
        }

        Client existing = clientRepositoryPort.findById(client.getId())
                .orElseThrow(() -> new ClientNotFoundException("Client not found: " + client.getId()));

        account.setClient(existing);
        return accountRepositoryPort.save(account);
    }

    @Override
    public Account update(Long id, Account account) {
        Account existing = accountRepositoryPort.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + id));

        account.setId(id);
        account.setCreatedAt(existing.getCreatedAt());
        account.setUpdatedAt(LocalDateTime.now());

        return accountRepositoryPort.save(account);
    }

    @Override
    public Account findById(Long id) {
        return accountRepositoryPort.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + id));
    }

    @Override
    public List<Account> findAll() {
        return accountRepositoryPort.findAll();
    }

    @Override
    public void delete(Long id) {
        Account account = accountRepositoryPort.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Account not found: " + id));

        transactionRepositoryPort.findBySourceAccountId(id)
                .forEach(transactionRepositoryPort::delete);
        transactionRepositoryPort.findByDestinationAccountId(id)
                .forEach(transactionRepositoryPort::delete);

        accountRepositoryPort.delete(account);
    }
}
