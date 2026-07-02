# Banking System - Ejemplos de Payloads para Testing

## Clientes

### Crear Cliente
```bash
POST http://localhost:8080/api/clients
Content-Type: application/json

{
  "identificationType": "CC",
  "identificationNumber": "123456789",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@email.com",
  "birthDate": "1990-05-15"
}
```

### Actualizar Cliente
```bash
PUT http://localhost:8080/api/clients/1
Content-Type: application/json

{
  "identificationType": "CC",
  "identificationNumber": "123456789",
  "firstName": "Juan Carlos",
  "lastName": "Pérez García",
  "email": "juan.carlos@email.com",
  "birthDate": "1990-05-15"
}
```

### Listar Clientes
```bash
GET http://localhost:8080/api/clients
```

### Obtener Cliente Específico
```bash
GET http://localhost:8080/api/clients/1
```

### Eliminar Cliente (Soft Delete)
```bash
DELETE http://localhost:8080/api/clients/1
```

---

## Cuentas

### Crear Cuenta
```bash
POST http://localhost:8080/api/accounts
Content-Type: application/json

{
  "accountNumber": "ACC001",
  "accountType": "CHECKING",
  "status": "ACTIVE",
  "balance": 5000.00,
  "exemptGmf": false,
  "client": {
    "id": 1
  }
}
```

### Crear Cuenta de Ahorros
```bash
POST http://localhost:8080/api/accounts
Content-Type: application/json

{
  "accountNumber": "SAV001",
  "accountType": "SAVINGS",
  "status": "ACTIVE",
  "balance": 10000.00,
  "exemptGmf": true,
  "client": {
    "id": 1
  }
}
```

### Actualizar Cuenta
```bash
PUT http://localhost:8080/api/accounts/1
Content-Type: application/json

{
  "accountNumber": "ACC001",
  "accountType": "CHECKING",
  "status": "ACTIVE",
  "balance": 7500.00,
  "exemptGmf": false,
  "client": {
    "id": 1
  }
}
```

### Listar Cuentas
```bash
GET http://localhost:8080/api/accounts
```

### Obtener Cuenta Específica
```bash
GET http://localhost:8080/api/accounts/1
```

### Eliminar Cuenta (Soft Delete)
```bash
DELETE http://localhost:8080/api/accounts/1
```

---

## Transacciones

### Crear Depósito
```bash
POST http://localhost:8080/api/transactions
Content-Type: application/json

{
  "type": "DEPOSIT",
  "amount": 500.00,
  "destinationAccount": {
    "id": 1
  }
}
```

### Crear Retiro
```bash
POST http://localhost:8080/api/transactions
Content-Type: application/json

{
  "type": "WITHDRAWAL",
  "amount": 200.00,
  "sourceAccount": {
    "id": 1
  }
}
```

### Crear Transferencia
```bash
POST http://localhost:8080/api/transactions
Content-Type: application/json

{
  "type": "TRANSFER",
  "amount": 1000.00,
  "sourceAccount": {
    "id": 1
  },
  "destinationAccount": {
    "id": 2
  }
}
```

### Listar Transacciones
```bash
GET http://localhost:8080/api/transactions
```

### Obtener Transacción Específica
```bash
GET http://localhost:8080/api/transactions/1
```

### Eliminar Transacción (Soft Delete)
```bash
DELETE http://localhost:8080/api/transactions/1
```

---

## Flujo Completo de Testing

### 1. Crear un cliente
```bash
POST http://localhost:8080/api/clients
{
  "identificationType": "CC",
  "identificationNumber": "987654321",
  "firstName": "María",
  "lastName": "González",
  "email": "maria@email.com",
  "birthDate": "1992-08-20"
}
```
Respuesta: `id: 1`

### 2. Crear dos cuentas para ese cliente
```bash
POST http://localhost:8080/api/accounts
{
  "accountNumber": "CHK001",
  "accountType": "CHECKING",
  "status": "ACTIVE",
  "balance": 5000.00,
  "exemptGmf": false,
  "client": {"id": 1}
}
```
Respuesta: `id: 1`

```bash
POST http://localhost:8080/api/accounts
{
  "accountNumber": "SAV001",
  "accountType": "SAVINGS",
  "status": "ACTIVE",
  "balance": 10000.00,
  "exemptGmf": true,
  "client": {"id": 1}
}
```
Respuesta: `id: 2`

### 3. Hacer depósito en la primera cuenta
```bash
POST http://localhost:8080/api/transactions
{
  "type": "DEPOSIT",
  "amount": 1000.00,
  "destinationAccount": {"id": 1}
}
```

### 4. Hacer transferencia de la primera a la segunda cuenta
```bash
POST http://localhost:8080/api/transactions
{
  "type": "TRANSFER",
  "amount": 2000.00,
  "sourceAccount": {"id": 1},
  "destinationAccount": {"id": 2}
}
```

### 5. Verificar saldos
```bash
GET http://localhost:8080/api/accounts/1
GET http://localhost:8080/api/accounts/2
```

Deberías ver:
- Cuenta 1: 5000 + 1000 - 2000 = 4000
- Cuenta 2: 10000 + 2000 = 12000

---

## Postman Collection (en formato JSON)

Puedes importar esta colección en Postman:

```json
{
  "info": {
    "name": "Banking System API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Clients",
      "item": [
        {
          "name": "Create Client",
          "request": {
            "method": "POST",
            "url": "http://localhost:8080/api/clients",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"identificationType\": \"CC\",\n  \"identificationNumber\": \"123456789\",\n  \"firstName\": \"Juan\",\n  \"lastName\": \"Pérez\",\n  \"email\": \"juan@email.com\",\n  \"birthDate\": \"1990-05-15\"\n}"
            }
          }
        },
        {
          "name": "List Clients",
          "request": {
            "method": "GET",
            "url": "http://localhost:8080/api/clients"
          }
        }
      ]
    },
    {
      "name": "Accounts",
      "item": [
        {
          "name": "Create Account",
          "request": {
            "method": "POST",
            "url": "http://localhost:8080/api/accounts",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"accountNumber\": \"ACC001\",\n  \"accountType\": \"CHECKING\",\n  \"status\": \"ACTIVE\",\n  \"balance\": 5000.00,\n  \"exemptGmf\": false,\n  \"client\": {\"id\": 1}\n}"
            }
          }
        },
        {
          "name": "List Accounts",
          "request": {
            "method": "GET",
            "url": "http://localhost:8080/api/accounts"
          }
        }
      ]
    },
    {
      "name": "Transactions",
      "item": [
        {
          "name": "Create Deposit",
          "request": {
            "method": "POST",
            "url": "http://localhost:8080/api/transactions",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"type\": \"DEPOSIT\",\n  \"amount\": 500.00,\n  \"destinationAccount\": {\"id\": 1}\n}"
            }
          }
        },
        {
          "name": "List Transactions",
          "request": {
            "method": "GET",
            "url": "http://localhost:8080/api/transactions"
          }
        }
      ]
    }
  ]
}
```

---

## Códigos de Estado HTTP Esperados

| Operación | Método | Código Esperado |
|-----------|--------|-----------------|
| Crear recurso | POST | 201 Created |
| Actualizar recurso | PUT | 200 OK |
| Obtener recurso | GET | 200 OK |
| Eliminar recurso | DELETE | 204 No Content |
| Recurso no encontrado | GET | 404 Not Found |
| Error en validación | POST/PUT | 400 Bad Request |

---

## Errores Comunes

### 1. ClientNotFoundException
Intenta crear una cuenta con un cliente que no existe
```bash
POST http://localhost:8080/api/accounts
{
  "accountNumber": "ACC999",
  "accountType": "CHECKING",
  "status": "ACTIVE",
  "balance": 1000.00,
  "exemptGmf": false,
  "client": {"id": 999}  // Cliente no existe
}
```
Resultado: `404 Not Found`

### 2. InsufficientFundsException
Intenta hacer retiro mayor al saldo
```bash
POST http://localhost:8080/api/transactions
{
  "type": "WITHDRAWAL",
  "amount": 50000.00,  // Mayor que el saldo disponible
  "sourceAccount": {"id": 1}
}
```
Resultado: `400 Bad Request`

### 3. El cliente tiene cuentas activas
No puedes eliminar un cliente que tiene cuentas vinculadas (aunque hay soft delete, la lógica del negocio puede variar)
