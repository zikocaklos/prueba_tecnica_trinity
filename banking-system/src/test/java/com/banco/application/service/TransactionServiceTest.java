package com.banco.application.service;

import com.banco.application.exception.InsufficientFundsException;
import com.banco.application.exception.TransactionNotFoundException;
import com.banco.domain.enums.AccountStatus;
import com.banco.domain.enums.AccountType;
import com.banco.domain.enums.TransactionType;
import com.banco.domain.model.Account;
import com.banco.domain.model.Transaction;
import com.banco.domain.ports.out.AccountRepositoryPort;
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
class TransactionServiceTest {

    @Mock
    private TransactionRepositoryPort transactionRepositoryPort;

    @Mock
    private AccountRepositoryPort accountRepositoryPort;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private Account sourceAccount;
    private Account destinationAccount;

    @BeforeEach
    void setUp() {
        sourceAccount = Account.builder()
                .id(1L)
                .accountNumber("SRC")
                .accountType(AccountType.SAVINGS)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("500.00"))
                .build();

        destinationAccount = Account.builder()
                .id(2L)
                .accountNumber("DST")
                .accountType(AccountType.CHECKING)
                .status(AccountStatus.ACTIVE)
                .balance(new BigDecimal("100.00"))
                .build();
    }

    @Test
    void shouldRejectDepositWhenDestinationAccountIsInactive() {
        Account inactiveDestination = Account.builder()
                .id(2L)
                .accountNumber("DST")
                .accountType(AccountType.CHECKING)
                .status(AccountStatus.INACTIVE)
                .balance(new BigDecimal("100.00"))
                .build();

        Transaction transaction = Transaction.builder()
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("100.00"))
                .destinationAccount(Account.builder().id(2L).build())
                .build();

        when(accountRepositoryPort.findById(2L)).thenReturn(Optional.of(inactiveDestination));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> transactionService.create(transaction));

        assertEquals("Destination account is inactive: 2", exception.getMessage());
        verify(transactionRepositoryPort, never()).save(any(Transaction.class));
    }

    @Test
    void shouldCreateDepositSuccessfully() {
        Transaction transaction = Transaction.builder()
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("100.00"))
                .destinationAccount(Account.builder().id(2L).build())
                .build();

        when(accountRepositoryPort.findById(2L)).thenReturn(Optional.of(destinationAccount));
        when(accountRepositoryPort.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(transactionRepositoryPort.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = transactionService.create(transaction);

        assertNotNull(result);
        assertEquals(TransactionType.DEPOSIT, result.getType());
        assertEquals(new BigDecimal("200.00"), destinationAccount.getBalance());
        verify(accountRepositoryPort).save(destinationAccount);
        verify(transactionRepositoryPort).save(transaction);
    }

    @Test
    void shouldCreateWithdrawalSuccessfully() {
        Transaction transaction = Transaction.builder()
                .type(TransactionType.WITHDRAWAL)
                .amount(new BigDecimal("50.00"))
                .sourceAccount(Account.builder().id(1L).build())
                .build();

        when(accountRepositoryPort.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepositoryPort.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(transactionRepositoryPort.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = transactionService.create(transaction);

        assertNotNull(result);
        assertEquals(new BigDecimal("450.00"), sourceAccount.getBalance());
        verify(accountRepositoryPort).save(sourceAccount);
    }

    @Test
    void shouldThrowExceptionWhenWithdrawalAmountExceedsBalance() {
        Transaction transaction = Transaction.builder()
                .type(TransactionType.WITHDRAWAL)
                .amount(new BigDecimal("600.00"))
                .sourceAccount(Account.builder().id(1L).build())
                .build();

        when(accountRepositoryPort.findById(1L)).thenReturn(Optional.of(sourceAccount));

        InsufficientFundsException exception = assertThrows(InsufficientFundsException.class, () -> transactionService.create(transaction));

        assertTrue(exception.getMessage().contains("Insufficient funds"));
        verify(transactionRepositoryPort, never()).save(any(Transaction.class));
    }

    @Test
    void shouldThrowExceptionWhenTransferAccountsAreMissing() {
        Transaction transaction = Transaction.builder()
                .type(TransactionType.TRANSFER)
                .amount(new BigDecimal("100.00"))
                .build();

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> transactionService.create(transaction));

        assertEquals("Source and destination accounts are required for transfer", exception.getMessage());
        verifyNoInteractions(accountRepositoryPort);
    }

    @Test
    void shouldThrowExceptionWhenSourceAccountDoesNotExistForTransfer() {
        Transaction transaction = Transaction.builder()
                .type(TransactionType.TRANSFER)
                .amount(new BigDecimal("100.00"))
                .sourceAccount(Account.builder().id(10L).build())
                .destinationAccount(Account.builder().id(2L).build())
                .build();

        when(accountRepositoryPort.findById(10L)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> transactionService.create(transaction));

        assertEquals("Source account not found: 10", exception.getMessage());
    }

    @Test
    void shouldCreateTransferSuccessfully() {
        Transaction transaction = Transaction.builder()
                .type(TransactionType.TRANSFER)
                .amount(new BigDecimal("100.00"))
                .sourceAccount(Account.builder().id(1L).build())
                .destinationAccount(Account.builder().id(2L).build())
                .build();

        when(accountRepositoryPort.findById(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepositoryPort.findById(2L)).thenReturn(Optional.of(destinationAccount));
        when(accountRepositoryPort.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(transactionRepositoryPort.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Transaction result = transactionService.create(transaction);

        assertNotNull(result);
        assertEquals(new BigDecimal("400.00"), sourceAccount.getBalance());
        assertEquals(new BigDecimal("200.00"), destinationAccount.getBalance());
        verify(accountRepositoryPort, times(2)).save(any(Account.class));
    }

    @Test
    void shouldFindTransactionByIdSuccessfully() {
        Transaction transaction = Transaction.builder().id(5L).type(TransactionType.DEPOSIT).amount(new BigDecimal("50.00")).build();
        when(transactionRepositoryPort.findById(5L)).thenReturn(Optional.of(transaction));

        Transaction result = transactionService.findById(5L);

        assertEquals(5L, result.getId());
        verify(transactionRepositoryPort).findById(5L);
    }

    @Test
    void shouldThrowExceptionWhenTransactionDoesNotExistOnFindById() {
        when(transactionRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        TransactionNotFoundException exception = assertThrows(TransactionNotFoundException.class, () -> transactionService.findById(99L));

        assertEquals("Transaction not found: 99", exception.getMessage());
    }

    @Test
    void shouldReturnAllTransactions() {
        when(transactionRepositoryPort.findAll()).thenReturn(List.of(Transaction.builder().id(1L).build()));

        List<Transaction> result = transactionService.findAll();

        assertEquals(1, result.size());
        verify(transactionRepositoryPort).findAll();
    }

    @Test
    void shouldReturnEmptyListWhenNoTransactionsExist() {
        when(transactionRepositoryPort.findAll()).thenReturn(List.of());

        List<Transaction> result = transactionService.findAll();

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldDeleteTransactionSuccessfully() {
        Transaction transaction = Transaction.builder().id(7L).deleted(false).build();
        when(transactionRepositoryPort.findById(7L)).thenReturn(Optional.of(transaction));
        when(transactionRepositoryPort.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        transactionService.delete(7L);

        assertTrue(transaction.getDeleted());
        verify(transactionRepositoryPort).save(transaction);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonexistentTransaction() {
        when(transactionRepositoryPort.findById(99L)).thenReturn(Optional.empty());

        TransactionNotFoundException exception = assertThrows(TransactionNotFoundException.class, () -> transactionService.delete(99L));

        assertEquals("Transaction not found: 99", exception.getMessage());
        verify(transactionRepositoryPort, never()).save(any(Transaction.class));
    }
}
