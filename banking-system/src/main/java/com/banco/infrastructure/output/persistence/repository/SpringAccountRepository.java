package com.banco.infrastructure.output.persistence.repository;

import com.banco.infrastructure.output.persistence.entity.AccountEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpringAccountRepository extends JpaRepository<AccountEntity, Long> {

    @Override
    @EntityGraph(attributePaths = {"client"})
    Optional<AccountEntity> findById(Long id);

    @Override
    @EntityGraph(attributePaths = {"client"})
    List<AccountEntity> findAll();
}
