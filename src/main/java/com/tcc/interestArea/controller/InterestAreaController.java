package com.tcc.interestArea.controller;

import com.tcc.interestArea.usecase.*;
import com.tcc.interestArea.dto.CreateInterestAreaDto;
import com.tcc.interestArea.dto.ResponseInterestAreaDto;
import com.tcc.interestArea.entity.InterestArea;
import com.tcc.student.usecase.GetByIdStudentUseCase;
import com.tcc.student.entity.Student;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/interest-areas")
@RequiredArgsConstructor
public class InterestAreaController {

    private final ModelMapper modelMapper;

    private final CreateInterestAreaUseCase createInterestAreaUseCase;
    private final GetAllInterestAreaUseCase getAllInterestAreaUseCase;
    private final GetByIdInterestAreaUseCase getByIdInterestAreaUseCase;
    private final UpdateInterestAreaUseCase updateInterestAreaUseCase;
    private final DeleteInterestAreaUseCase deleteInterestAreaUseCase;
    
    // Use cases for many-to-many relationships
    private final GetByIdStudentUseCase getByIdStudentUseCase;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CreateInterestAreaDto createInterestAreaDto) {
        InterestArea InterestArea = modelMapper.map(createInterestAreaDto, InterestArea.class);
        
        // Handle composite foreign keys
        
        // Handle many-to-many relationships
        if (createInterestAreaDto.getStudents() != null && !createInterestAreaDto.getStudents().isEmpty()) {
            List<Student> students = createInterestAreaDto.getStudents().stream()
                .map(relationshipDto -> getByIdStudentUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            InterestArea.setStudents(students);
        }
        
        createInterestAreaUseCase.execute(InterestArea);
        return ResponseEntity.created(null).build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseInterestAreaDto>> getAll(
            @RequestParam(required = false) String name
    ) {
        List<InterestArea> InterestAreas = getAllInterestAreaUseCase.execute(name);
        
        List<ResponseInterestAreaDto> response = InterestAreas.stream()
                .map(InterestArea -> modelMapper.map(InterestArea, ResponseInterestAreaDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseInterestAreaDto> getById(
            @PathVariable String id) {
        InterestArea InterestArea = getByIdInterestAreaUseCase.execute(id);
        ResponseInterestAreaDto response = modelMapper.map(InterestArea, ResponseInterestAreaDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseInterestAreaDto> update(
            @PathVariable String id,
            @RequestBody @Valid CreateInterestAreaDto updateInterestAreaDto) {
        InterestArea InterestArea = modelMapper.map(updateInterestAreaDto, InterestArea.class);
        
        // Handle many-to-many relationships
        if (updateInterestAreaDto.getStudents() != null) {
            List<Student> students = updateInterestAreaDto.getStudents().stream()
                .map(relationshipDto -> getByIdStudentUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            InterestArea.setStudents(students);
        }
        
        InterestArea updatedInterestArea = updateInterestAreaUseCase.execute(id, InterestArea);
        ResponseInterestAreaDto response = modelMapper.map(updatedInterestArea, ResponseInterestAreaDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteInterestAreaUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
