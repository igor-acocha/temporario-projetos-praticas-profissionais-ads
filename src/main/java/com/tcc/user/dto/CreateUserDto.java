package com.tcc.user.dto;

import com.tcc.user.enums.TypeProfile;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserDto {
    @NotBlank(message = "O nome não pode estar em branco.")
    private String name;

    @NotBlank(message = "O CPF/CNPJ não pode estar em branco.")
    private String cpfCnpj;

    @NotBlank(message = "O e-mail não pode estar em branco.")
    @Email(message = "Formato de e-mail inválido.")
    private String email;

    @NotBlank(message = "A senha não pode estar em branco.")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
    private String password;

    @NotNull(message = "O tipo de perfil é obrigatório.")
    private TypeProfile typeProfile;
}