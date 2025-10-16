package com.tcc.administrator.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.Valid;

@Data
public class CreateAdministratorDto {

    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String creationDate;

}
