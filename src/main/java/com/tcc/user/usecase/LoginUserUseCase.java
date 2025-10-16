package com.tcc.user.usecase;

import com.tcc.user.adapter.repository.UserRepository;
import com.tcc.config.JwtTokenProvider;
import com.tcc.user.dto.LoginUserDto;
import com.tcc.user.entity.User;
import com.tcc.user.exception.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginUserUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginUserUseCase(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public String execute(LoginUserDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Usuário com o e-mail " + dto.getEmail() + " não encontrado."));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Senha incorreta.");
        }

        return jwtTokenProvider.createToken(user.getEmail(), user.getTypeProfile().name());
    }
}