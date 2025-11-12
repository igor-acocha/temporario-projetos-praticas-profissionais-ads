package com.tcc.user.usecase;

import com.tcc.user.adapter.repository.PasswordResetTokenRepository;
import com.tcc.user.adapter.repository.UserRepository;
import com.tcc.user.dto.ResetPasswordDto;
import com.tcc.user.entity.PasswordResetToken;
import com.tcc.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ResetPasswordUseCase {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;

    public void execute(ResetPasswordDto dto) {
        var token = tokenRepository.findByToken(dto.getCode())
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (token.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expirado");
        }

        var user = token.getUser();
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        tokenRepository.delete(token); // remove o token usado
    }
}

