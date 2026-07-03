package com.banco.infrastructure.output.persistence.adapter;

import com.banco.domain.model.Transaction;
import com.banco.domain.ports.out.TransactionRepositoryPort;
import com.banco.infrastructure.mapping.TransactionMapper;
import com.banco.infrastructure.output.persistence.entity.TransactionEntity;
import com.banco.infrastructure.output.persistence.repository.SpringAccountRepository;
import com.banco.infrastructure.output.persistence.repository.SpringTransactionRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class TransactionRepositoryAdapter implements TransactionRepositoryPort {

    private final SpringTransactionRepository transactionRepository;
    private final SpringAccountRepository accountRepository;

    public TransactionRepositoryAdapter(SpringTransactionRepository transactionRepository, SpringAccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public Transaction save(Transaction transaction) {
        LocalDateTime now = LocalDateTime.now();
        TransactionEntity entity = TransactionMapper.toEntity(transaction);

        if (entity.getSourceAccount() != null && entity.getSourceAccount().getId() != null) {
            entity.setSourceAccount(accountRepository.getReferenceById(entity.getSourceAccount().getId()));
        }

        if (entity.getDestinationAccount() != null && entity.getDestinationAccount().getId() != null) {
            entity.setDestinationAccount(accountRepository.getReferenceById(entity.getDestinationAccount().getId()));
        }

        if (entity.getId() == null) {
            entity.setTransactionDate(now);
        }

        TransactionEntity saved = transactionRepository.save(entity);

        // Map to domain and enrich account references with full account info to include accountNumber
        com.banco.domain.model.Transaction txDomain = TransactionMapper.toDomain(saved);

        if (saved.getSourceAccount() != null && saved.getSourceAccount().getId() != null) {
            accountRepository.findById(saved.getSourceAccount().getId()).ifPresent(accEntity ->
                txDomain.setSourceAccount(com.banco.infrastructure.mapping.AccountMapper.toDomain(accEntity))
            );
        }

        if (saved.getDestinationAccount() != null && saved.getDestinationAccount().getId() != null) {
            accountRepository.findById(saved.getDestinationAccount().getId()).ifPresent(accEntity ->
                txDomain.setDestinationAccount(com.banco.infrastructure.mapping.AccountMapper.toDomain(accEntity))
            );
        }

        return txDomain;
    }

    @Override
    public Optional<Transaction> findById(Long id) {
        return transactionRepository.findById(id)
                .filter(entity -> entity.getDeleted() == null || !entity.getDeleted())
                .map(TransactionMapper::toDomain);
    }

    @Override
    public List<Transaction> findAll() {
        return transactionRepository.findAll().stream()
                .filter(entity -> entity.getDeleted() == null || !entity.getDeleted())
                .map(TransactionMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Transaction> findBySourceAccountId(Long accountId) {
        return transactionRepository.findBySourceAccountId(accountId).stream()
                .filter(entity -> entity.getDeleted() == null || !entity.getDeleted())
                .map(TransactionMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Transaction> findByDestinationAccountId(Long accountId) {
        return transactionRepository.findByDestinationAccountId(accountId).stream()
                .filter(entity -> entity.getDeleted() == null || !entity.getDeleted())
                .map(TransactionMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Transaction transaction) {
        if (transaction == null || transaction.getId() == null) {
            throw new IllegalArgumentException("Transaction id is required for delete");
        }

        TransactionEntity entity = transactionRepository.findById(transaction.getId())
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transaction.getId()));
        entity.setDeleted(true);
        transactionRepository.save(entity);
    }
}
