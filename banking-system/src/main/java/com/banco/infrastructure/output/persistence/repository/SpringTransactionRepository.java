package com.banco.infrastructure.output.persistence.repository;

import com.banco.infrastructure.output.persistence.entity.TransactionEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringTransactionRepository extends JpaRepository<TransactionEntity, Long> {

    @EntityGraph(attributePaths = {"sourceAccount", "destinationAccount"})
    List<TransactionEntity> findBySourceAccountId(Long accountId);

    @EntityGraph(attributePaths = {"sourceAccount", "destinationAccount"})
    List<TransactionEntity> findByDestinationAccountId(Long accountId);

    @Override
    @EntityGraph(attributePaths = {"sourceAccount", "destinationAccount"})
    List<TransactionEntity> findAll();

    @Override
    @EntityGraph(attributePaths = {"sourceAccount", "destinationAccount"})
    java.util.Optional<TransactionEntity> findById(Long id);
}
