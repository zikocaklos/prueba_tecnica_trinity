package com.banco.domain.ports.out;

import com.banco.domain.model.Account;

import java.util.List;
import java.util.Optional;

public interface AccountRepositoryPort {

    Account save(Account account);

    Optional<Account> findById(Long id);

    List<Account> findAll();

    void delete(Account account);
}
