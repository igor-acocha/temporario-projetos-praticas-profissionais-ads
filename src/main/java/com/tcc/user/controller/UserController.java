package com.tcc.user.controller;

import com.tcc.user.dto.CreateUserDto;
import com.tcc.user.dto.LoginUserDto;
import com.tcc.user.dto.TokenUserDto;
import com.tcc.user.entity.User;
import com.tcc.user.usecase.CreateUserUseCase;
import com.tcc.user.usecase.LoginUserUseCase;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final CreateUserUseCase registerUserUseCase;
    private final LoginUserUseCase loginUserUseCase;

    public UserController(CreateUserUseCase registerUserUseCase, LoginUserUseCase loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @Valid CreateUserDto dto) {
        User newUser = registerUserUseCase.execute(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenUserDto> login(@RequestBody @Valid LoginUserDto dto) {
        String token = loginUserUseCase.execute(dto);
        return ResponseEntity.ok(new TokenUserDto(token));
    }
}