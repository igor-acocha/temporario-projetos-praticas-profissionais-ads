package com.tcc.administrator.controller;

import com.tcc.administrator.usecase.*;
import com.tcc.administrator.dto.CreateAdministratorDto;
import com.tcc.administrator.dto.ResponseAdministratorDto;
import com.tcc.administrator.entity.Administrator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/administrators")
@RequiredArgsConstructor
public class AdministratorController {

    private final ModelMapper modelMapper;

    private final CreateAdministratorUseCase createAdministratorUseCase;
    private final GetAllAdministratorUseCase getAllAdministratorUseCase;
    private final GetByIdAdministratorUseCase getByIdAdministratorUseCase;
    private final UpdateAdministratorUseCase updateAdministratorUseCase;
    private final DeleteAdministratorUseCase deleteAdministratorUseCase;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CreateAdministratorDto createAdministratorDto) {
        Administrator Administrator = modelMapper.map(createAdministratorDto, Administrator.class);
        
        // Handle composite foreign keys
        
        createAdministratorUseCase.execute(Administrator);
        return ResponseEntity.created(null).build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseAdministratorDto>> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) String creationDate
    ) {
        List<Administrator> Administrators = getAllAdministratorUseCase.execute(name, email, password, creationDate);
        
        List<ResponseAdministratorDto> response = Administrators.stream()
                .map(Administrator -> modelMapper.map(Administrator, ResponseAdministratorDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseAdministratorDto> getById(
            @PathVariable String id) {
        Administrator Administrator = getByIdAdministratorUseCase.execute(id);
        ResponseAdministratorDto response = modelMapper.map(Administrator, ResponseAdministratorDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseAdministratorDto> update(
            @PathVariable String id,
            @RequestBody @Valid CreateAdministratorDto updateAdministratorDto) {
        Administrator Administrator = modelMapper.map(updateAdministratorDto, Administrator.class);
        
        Administrator updatedAdministrator = updateAdministratorUseCase.execute(id, Administrator);
        ResponseAdministratorDto response = modelMapper.map(updatedAdministrator, ResponseAdministratorDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteAdministratorUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
