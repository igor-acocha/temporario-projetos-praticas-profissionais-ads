package com.tcc.user.usecase;

import com.tcc.user.dto.CreateUserDto;
import com.tcc.user.entity.User;
import com.tcc.user.adapter.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CreateUserUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CreateUserUseCase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User execute(CreateUserDto dto) {
        User user = User.builder()
                .name(dto.getName())
                .cpfCnpj(dto.getCpfCnpj())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .typeProfile(dto.getTypeProfile())
                .build();

        return userRepository.save(user);
    }
}
