package com.banco;

import com.banco.domain.ports.in.AccountServicePort;
import com.banco.domain.ports.in.ClientServicePort;
import com.banco.domain.ports.in.TransactionServicePort;
import org.mockito.Mockito;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

@SpringBootConfiguration
@EnableAutoConfiguration(exclude = {
        DataSourceAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class,
        JpaRepositoriesAutoConfiguration.class,
        SecurityAutoConfiguration.class
})
@ComponentScan(basePackages = "com.banco.infrastructure.input")
public class TestWebMvcConfig {

    @Bean
    public ClientServicePort clientServicePort() {
        return Mockito.mock(ClientServicePort.class);
    }

    @Bean
    public AccountServicePort accountServicePort() {
        return Mockito.mock(AccountServicePort.class);
    }

    @Bean
    public TransactionServicePort transactionServicePort() {
        return Mockito.mock(TransactionServicePort.class);
    }
}
