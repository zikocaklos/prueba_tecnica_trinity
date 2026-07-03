package com.banco.infrastructure.output.persistence.adapter;

import com.banco.domain.model.Account;
import com.banco.domain.ports.out.AccountRepositoryPort;
import com.banco.infrastructure.mapping.AccountMapper;
import com.banco.infrastructure.output.persistence.entity.AccountEntity;
import com.banco.infrastructure.output.persistence.repository.SpringAccountRepository;
import com.banco.infrastructure.output.persistence.repository.SpringClientRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class AccountRepositoryAdapter implements AccountRepositoryPort {

    private final SpringAccountRepository accountRepository;
    private final SpringClientRepository clientRepository;

    public AccountRepositoryAdapter(SpringAccountRepository accountRepository, SpringClientRepository clientRepository) {
        this.accountRepository = accountRepository;
        this.clientRepository = clientRepository;
    }

    @Override
    public Account save(Account account) {
        LocalDateTime now = LocalDateTime.now();
        AccountEntity entity = AccountMapper.toEntity(account);

        if (entity.getClient() != null && entity.getClient().getId() != null) {
            entity.setClient(clientRepository.getReferenceById(entity.getClient().getId()));
        }

        if (entity.getId() == null) {
            entity.setCreatedAt(now);
        } else {
            entity.setUpdatedAt(now);
        }

        AccountEntity saved = accountRepository.save(entity);
        return AccountMapper.toDomain(saved);
    }

    @Override
    public Optional<Account> findById(Long id) {
        return accountRepository.findById(id)
                .filter(entity -> entity.getDeleted() == null || !entity.getDeleted())
                .map(AccountMapper::toDomain);
    }

    @Override
    public List<Account> findAll() {
        return accountRepository.findAll().stream()
                .filter(entity -> entity.getDeleted() == null || !entity.getDeleted())
                .map(AccountMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Account account) {
        if (account == null || account.getId() == null) {
            throw new IllegalArgumentException("Account id is required for delete");
        }
        account.setDeleted(true);
        accountRepository.save(AccountMapper.toEntity(account));
    }
}
