package com.banco.domain.ports.in;

import com.banco.domain.model.Account;

import java.util.List;

public interface AccountServicePort {

	Account create(Account account);

	Account update(Long id, Account account);

	Account findById(Long id);

	List<Account> findAll();

	void delete(Long id);
}

