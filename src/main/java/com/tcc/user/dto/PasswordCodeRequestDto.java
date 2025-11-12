package com.tcc.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordCodeRequestDto {

    @Email
    @NotBlank
    private String email;
}
