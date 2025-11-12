package com.tcc.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDto {

    @NotBlank
    private String code;

    @NotBlank
    private String newPassword;
}
