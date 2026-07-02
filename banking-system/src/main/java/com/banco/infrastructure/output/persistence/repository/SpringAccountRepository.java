package com.banco.infrastructure.output.persistence.repository;

import com.banco.infrastructure.output.persistence.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringAccountRepository extends JpaRepository<AccountEntity, Long> {
}
