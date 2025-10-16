package com.tcc.application.controller;

import com.tcc.application.usecase.*;
import com.tcc.application.dto.CreateApplicationDto;
import com.tcc.application.dto.ResponseApplicationDto;
import com.tcc.application.entity.Application;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ModelMapper modelMapper;

    private final CreateApplicationUseCase createApplicationUseCase;
    private final GetAllApplicationUseCase getAllApplicationUseCase;
    private final GetByIdApplicationUseCase getByIdApplicationUseCase;
    private final UpdateApplicationUseCase updateApplicationUseCase;
    private final DeleteApplicationUseCase deleteApplicationUseCase;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CreateApplicationDto createApplicationDto) {
        Application Application = modelMapper.map(createApplicationDto, Application.class);
        
        // Handle composite foreign keys
        
        createApplicationUseCase.execute(Application);
        return ResponseEntity.created(null).build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseApplicationDto>> getAll(
            @RequestParam(required = false) String idea,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String applicationDate,
            @RequestParam(required = false) String idStudent,
            @RequestParam(required = false) String idProject
    ) {
        List<Application> Applications = getAllApplicationUseCase.execute(idea, status, applicationDate, idStudent, idProject);
        
        List<ResponseApplicationDto> response = Applications.stream()
                .map(Application -> modelMapper.map(Application, ResponseApplicationDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseApplicationDto> getById(
            @PathVariable String id) {
        Application Application = getByIdApplicationUseCase.execute(id);
        ResponseApplicationDto response = modelMapper.map(Application, ResponseApplicationDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseApplicationDto> update(
            @PathVariable String id,
            @RequestBody @Valid CreateApplicationDto updateApplicationDto) {
        Application Application = modelMapper.map(updateApplicationDto, Application.class);
        
        Application updatedApplication = updateApplicationUseCase.execute(id, Application);
        ResponseApplicationDto response = modelMapper.map(updatedApplication, ResponseApplicationDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteApplicationUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
