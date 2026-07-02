package com.banco.domain.ports.in;

import com.banco.domain.model.Transaction;

import java.util.List;

public interface TransactionServicePort {

    Transaction create(Transaction transaction);

    Transaction findById(Long id);

    List<Transaction> findAll();

    void delete(Long id);

}
