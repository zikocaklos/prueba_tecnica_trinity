package com.banco.application.service;

import com.banco.application.exception.AccountNotFoundException;
import com.banco.application.exception.ClientNotFoundException;
import com.banco.domain.enums.AccountStatus;
import com.banco.domain.enums.AccountType;
import com.banco.domain.model.Account;
import com.banco.domain.model.Client;
import com.banco.domain.model.Transaction;
import com.banco.domain.ports.out.AccountRepositoryPort;
import com.banco.domain.ports.out.ClientRepositoryPort;
import com.banco.domain.ports.out.TransactionRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepositoryPort accountRepositoryPort;

    @Mock
    private ClientRepositoryPort clientRepositoryPort;

    @Mock
    private TransactionRepositoryPort transactionRepositoryPort;

    @InjectMocks
    private AccountServiceImpl accountService;

    private Account account;
    private Client client;

    @BeforeEach
    void setUp() {
        client = Client.builder().id(10L).firstName("Carlos").lastName("Pérez").build();
        account = Account.builder()
                .id(1L)
                .accountNumber("ACC-001")
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("1000.00"))
                .exemptGmf(false)
                .client(client)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void shouldCreateAccountSuccessfully() {
        when(clientRepositoryPort.findById(10L)).thenReturn(Optional.of(client));
        when(accountRepositoryPort.save(any(Account.class))).thenReturn(account);

        Account created = accountService.create(account);

        assertNotNull(created);
        assertEquals("ACC-001", created.getAccountNumber());
        assertEquals(client.getId(), created.getClient().getId());
        verify(clientRepositoryPort).findById(10L);
        verify(accountRepositoryPort).save(account);
    }

    @Test
    void shouldGenerateNewAccountNumberWhenRequestedNumberAlreadyExists() {
        when(clientRepositoryPort.findById(10L)).thenReturn(Optional.of(client));
        when(accountRepositoryPort.findAll()).thenReturn(List.of(Account.builder().accountNumber("5300000001").accountType(AccountType.SAVINGS).build()));
        when(accountRepositoryPort.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Account duplicateAccount = Account.builder()
                .accountNumber("5300000001")
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("100.00"))
                .client(client)
                .build();

        Account created = accountService.create(duplicateAccount);

        assertEquals("5300000002", created.getAccountNumber());
        verify(accountRepositoryPort).save(duplicateAccount);
    }

    @Test
    void shouldThrowExceptionWhenCreatingAccountWithoutClient() {
        Account invalidAccount = Account.builder().accountNumber("ACC-002").build();

        ClientNotFoundException exception = assertThrows(ClientNotFoundException.class, () -> accountService.create(invalidAccount));

        assertEquals("Client id required to create account", exception.getMessage());
        verifyNoInteractions(clientRepositoryPort);
        verify(accountRepositoryPort, never()).save(any(Account.class));
    }

    @Test
    void shouldThrowExceptionWhenClientDoesNotExistOnCreate() {
        account.setClient(Client.builder().id(99L).build());
        when(clientRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        ClientNotFoundException exception = assertThrows(ClientNotFoundException.class, () -> accountService.create(account));

        assertEquals("Client not found: 99", exception.getMessage());
        verify(clientRepositoryPort).findById(99L);
    }

    @Test
    void shouldFindAccountByIdSuccessfully() {
        when(accountRepositoryPort.findById(1L)).thenReturn(Optional.of(account));

        Account found = accountService.findById(1L);

        assertNotNull(found);
        assertEquals(1L, found.getId());
        verify(accountRepositoryPort).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenAccountDoesNotExistOnFindById() {
        when(accountRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        AccountNotFoundException exception = assertThrows(AccountNotFoundException.class, () -> accountService.findById(99L));

        assertEquals("Account not found: 99", exception.getMessage());
    }

    @Test
    void shouldReturnAllAccounts() {
        when(accountRepositoryPort.findAll()).thenReturn(List.of(account, Account.builder().id(2L).build()));

        List<Account> result = accountService.findAll();

        assertEquals(2, result.size());
        verify(accountRepositoryPort).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenNoAccountsExist() {
        when(accountRepositoryPort.findAll()).thenReturn(List.of());

        List<Account> result = accountService.findAll();

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldUpdateAccountSuccessfully() {
        Account updatedAccount = Account.builder()
                .accountNumber("ACC-999")
                .accountType(AccountType.CHECKING)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("2500.00"))
                .client(client)
                .build();

        when(accountRepositoryPort.findById(1L)).thenReturn(Optional.of(account));
        when(accountRepositoryPort.save(any(Account.class))).thenReturn(updatedAccount);

        Account result = accountService.update(1L, updatedAccount);

        assertEquals(1L, result.getId());
        assertEquals("ACC-999", result.getAccountNumber());
        verify(accountRepositoryPort).save(any(Account.class));
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonexistentAccount() {
        when(accountRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        AccountNotFoundException exception = assertThrows(AccountNotFoundException.class, () -> accountService.update(99L, account));

        assertEquals("Account not found: 99", exception.getMessage());
        verify(accountRepositoryPort, never()).save(any(Account.class));
    }

    @Test
    void shouldDeleteAccountAndAssociatedTransactions() {
        Transaction sourceTx = Transaction.builder().id(1L).build();
        Transaction destinationTx = Transaction.builder().id(2L).build();
        when(accountRepositoryPort.findById(1L)).thenReturn(Optional.of(account));
        when(transactionRepositoryPort.findBySourceAccountId(1L)).thenReturn(List.of(sourceTx));
        when(transactionRepositoryPort.findByDestinationAccountId(1L)).thenReturn(List.of(destinationTx));
        doNothing().when(transactionRepositoryPort).delete(sourceTx);
        doNothing().when(transactionRepositoryPort).delete(destinationTx);
        doNothing().when(accountRepositoryPort).delete(account);

        accountService.delete(1L);

        verify(transactionRepositoryPort).delete(sourceTx);
        verify(transactionRepositoryPort).delete(destinationTx);
        verify(accountRepositoryPort).delete(account);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonexistentAccount() {
        when(accountRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        AccountNotFoundException exception = assertThrows(AccountNotFoundException.class, () -> accountService.delete(99L));

        assertEquals("Account not found: 99", exception.getMessage());
        verify(accountRepositoryPort, never()).delete(any(Account.class));
    }
}
