package com.banco.infrastructure.output.persistence.repository;

import com.banco.infrastructure.output.persistence.entity.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringClientRepository extends JpaRepository<ClientEntity, Long> {
}
