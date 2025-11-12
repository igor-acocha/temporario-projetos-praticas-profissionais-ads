package com.tcc.user.usecase;

import com.tcc.user.adapter.repository.PasswordResetTokenRepository;
import com.tcc.user.adapter.repository.UserRepository;
import com.tcc.user.dto.PasswordCodeRequestDto;
import com.tcc.user.entity.PasswordResetToken;
import com.tcc.user.service.EmailService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GeneratePasswordResetTokenUseCase {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    @Transactional
    public String execute(PasswordCodeRequestDto dto) {
        var user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        String code = generateVerificationCode();
        LocalDateTime expiration = LocalDateTime.now().plusMinutes(15);

        // Verifica se já existe um token pra esse user
        var existingOpt = tokenRepository.findByUserId(user.getId());
        if (existingOpt.isPresent()) {
            PasswordResetToken existing = existingOpt.get();
            existing.setToken(code);
            existing.setExpirationDate(expiration);
            tokenRepository.save(existing); // faz UPDATE
        } else {
            PasswordResetToken resetToken = new PasswordResetToken(user,code, expiration);
            tokenRepository.save(resetToken); // faz INSERT
        }

        emailService.sendPasswordResetEmail(user.getEmail(), code);
        return code;
    }

    private String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int number = 100000 + random.nextInt(900000); // Gera número entre 100000 e 999999
        return String.valueOf(number);
    }
}