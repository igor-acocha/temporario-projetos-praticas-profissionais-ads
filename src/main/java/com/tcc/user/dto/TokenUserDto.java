package com.tcc.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO (Data Transfer Object) para encapsular o token JWT retornado no login.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenUserDto {
    private String token;
}