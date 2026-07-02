package com.banco.application.service;

import com.banco.application.exception.InsufficientFundsException;
import com.banco.application.exception.TransactionNotFoundException;
import com.banco.domain.enums.TransactionType;
import com.banco.domain.model.Account;
import com.banco.domain.model.Transaction;
import com.banco.domain.ports.in.TransactionServicePort;
import com.banco.domain.ports.out.AccountRepositoryPort;
import com.banco.domain.ports.out.TransactionRepositoryPort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionServicePort {

    private final TransactionRepositoryPort transactionRepositoryPort;
    private final AccountRepositoryPort accountRepositoryPort;

    public TransactionServiceImpl(TransactionRepositoryPort transactionRepositoryPort, AccountRepositoryPort accountRepositoryPort) {
        this.transactionRepositoryPort = transactionRepositoryPort;
        this.accountRepositoryPort = accountRepositoryPort;
    }

    @Override
    public Transaction create(Transaction transaction) {
        if (transaction.getTransactionDate() == null) {
            transaction.setTransactionDate(LocalDateTime.now());
        }

        TransactionType type = transaction.getType();
        BigDecimal amount = transaction.getAmount();

        if (type == TransactionType.DEPOSIT) {
            Account dest = transaction.getDestinationAccount();
            if (dest == null || dest.getId() == null) {
                throw new IllegalArgumentException("Destination account is required for deposit");
            }
            Account existingDest = accountRepositoryPort.findById(dest.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Destination account not found: " + dest.getId()));

            existingDest.setBalance((existingDest.getBalance() == null ? BigDecimal.ZERO : existingDest.getBalance()).add(amount));
            accountRepositoryPort.save(existingDest);
            transaction.setDestinationAccount(existingDest);

        } else if (type == TransactionType.WITHDRAWAL) {
            Account src = transaction.getSourceAccount();
            if (src == null || src.getId() == null) {
                throw new IllegalArgumentException("Source account is required for withdrawal");
            }
            Account existingSrc = accountRepositoryPort.findById(src.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Source account not found: " + src.getId()));

            BigDecimal current = existingSrc.getBalance() == null ? BigDecimal.ZERO : existingSrc.getBalance();
            if (current.compareTo(amount) < 0) {
                throw new InsufficientFundsException("Insufficient funds in account: " + src.getId());
            }

            existingSrc.setBalance(current.subtract(amount));
            accountRepositoryPort.save(existingSrc);
            transaction.setSourceAccount(existingSrc);

        } else if (type == TransactionType.TRANSFER) {
            Account src = transaction.getSourceAccount();
            Account dest = transaction.getDestinationAccount();
            if (src == null || src.getId() == null || dest == null || dest.getId() == null) {
                throw new IllegalArgumentException("Source and destination accounts are required for transfer");
            }

            Account existingSrc = accountRepositoryPort.findById(src.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Source account not found: " + src.getId()));
            Account existingDest = accountRepositoryPort.findById(dest.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Destination account not found: " + dest.getId()));

            BigDecimal current = existingSrc.getBalance() == null ? BigDecimal.ZERO : existingSrc.getBalance();
            if (current.compareTo(amount) < 0) {
                throw new InsufficientFundsException("Insufficient funds in account: " + src.getId());
            }

            existingSrc.setBalance(current.subtract(amount));
            existingDest.setBalance((existingDest.getBalance() == null ? BigDecimal.ZERO : existingDest.getBalance()).add(amount));

            accountRepositoryPort.save(existingSrc);
            accountRepositoryPort.save(existingDest);

            transaction.setSourceAccount(existingSrc);
            transaction.setDestinationAccount(existingDest);
        }

        return transactionRepositoryPort.save(transaction);
    }

    @Override
    public Transaction findById(Long id) {
        return transactionRepositoryPort.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found: " + id));
    }

    @Override
    public List<Transaction> findAll() {
        return transactionRepositoryPort.findAll();
    }

    @Override
    public void delete(Long id) {
        Transaction transaction = transactionRepositoryPort.findById(id)
                .orElseThrow(() -> new TransactionNotFoundException("Transaction not found: " + id));
        transaction.setDeleted(true);
        transactionRepositoryPort.save(transaction);
    }
}
