package com.banco.infrastructure.input.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientRequest {

    private Long id;

    @NotBlank(message = "Tipo de identificación es requerido")
    private String identificationType;

    @NotBlank(message = "Número de identificación es requerido")
    private String identificationNumber;

    @NotBlank(message = "Nombre es requerido")
    @Size(min = 2, message = "Nombre debe tener al menos 2 caracteres")
    private String firstName;

    @NotBlank(message = "Apellido es requerido")
    @Size(min = 2, message = "Apellido debe tener al menos 2 caracteres")
    private String lastName;

    @NotBlank(message = "Email es requerido")
    @Email(message = "Email debe ser válido")
    private String email;

    @NotNull(message = "Fecha de nacimiento es requerida")
    private LocalDate birthDate;
}
