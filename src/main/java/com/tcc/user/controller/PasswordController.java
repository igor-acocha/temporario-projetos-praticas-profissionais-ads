package com.tcc.user.controller;

import com.tcc.user.dto.PasswordCodeRequestDto;
import com.tcc.user.dto.ResetPasswordDto;
import com.tcc.user.usecase.GeneratePasswordResetTokenUseCase;
import com.tcc.user.usecase.ResetPasswordUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/password")
@RequiredArgsConstructor
public class PasswordController {

    private final GeneratePasswordResetTokenUseCase generatePasswordResetCodeUseCase;
    private final ResetPasswordUseCase resetPasswordUseCase;

    @PostMapping("/request-code")
    public ResponseEntity<String> requestPasswordCode(@RequestBody @Valid PasswordCodeRequestDto dto) {
        generatePasswordResetCodeUseCase.execute(dto);
        return ResponseEntity.ok().build(); // não retorna o token
    }

    @PostMapping("/reset")
    public ResponseEntity<Void> resetPassword(@RequestBody @Valid ResetPasswordDto dto) {
        resetPasswordUseCase.execute(dto);
        return ResponseEntity.ok().build();
    }
}
