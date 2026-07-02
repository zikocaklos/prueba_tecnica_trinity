package com.banco.domain.ports.out;

import com.banco.domain.model.Transaction;

import java.util.List;
import java.util.Optional;

public interface TransactionRepositoryPort {

    Transaction save(Transaction transaction);

    Optional<Transaction> findById(Long id);

    List<Transaction> findAll();

    List<Transaction> findBySourceAccountId(Long accountId);

    List<Transaction> findByDestinationAccountId(Long accountId);

    void delete(Transaction transaction);
}
