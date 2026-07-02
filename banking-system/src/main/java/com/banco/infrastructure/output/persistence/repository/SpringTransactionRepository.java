package com.banco.infrastructure.output.persistence.repository;

import com.banco.infrastructure.output.persistence.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringTransactionRepository extends JpaRepository<TransactionEntity, Long> {

    List<TransactionEntity> findBySourceAccountId(Long accountId);

    List<TransactionEntity> findByDestinationAccountId(Long accountId);
}
