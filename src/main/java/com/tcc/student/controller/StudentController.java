package com.tcc.student.controller;

import com.tcc.student.usecase.*;
import com.tcc.student.dto.CreateStudentDto;
import com.tcc.student.dto.ResponseStudentDto;
import com.tcc.student.entity.Student;
import com.tcc.interestArea.usecase.GetByIdInterestAreaUseCase;
import com.tcc.interestArea.entity.InterestArea;
import com.tcc.skill.usecase.GetByIdSkillUseCase;
import com.tcc.skill.entity.Skill;
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
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
public class StudentController {

    private final ModelMapper modelMapper;

    private final CreateStudentUseCase createStudentUseCase;
    private final GetAllStudentUseCase getAllStudentUseCase;
    private final GetByIdStudentUseCase getByIdStudentUseCase;
    private final UpdateStudentUseCase updateStudentUseCase;
    private final DeleteStudentUseCase deleteStudentUseCase;
    
    // Use cases for many-to-many relationships
    private final GetByIdInterestAreaUseCase getByIdInterestAreaUseCase;
    private final GetByIdSkillUseCase getByIdSkillUseCase;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CreateStudentDto createStudentDto) {
        Student Student = modelMapper.map(createStudentDto, Student.class);
        
        // Handle composite foreign keys
        
        // Handle many-to-many relationships
        if (createStudentDto.getInterestAreas() != null && !createStudentDto.getInterestAreas().isEmpty()) {
            List<InterestArea> interestAreas = createStudentDto.getInterestAreas().stream()
                .map(relationshipDto -> getByIdInterestAreaUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            Student.setInterestAreas(interestAreas);
        }
        if (createStudentDto.getSkills() != null && !createStudentDto.getSkills().isEmpty()) {
            List<Skill> skills = createStudentDto.getSkills().stream()
                .map(relationshipDto -> getByIdSkillUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            Student.setSkills(skills);
        }
        
        createStudentUseCase.execute(Student);
        return ResponseEntity.created(null).build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseStudentDto>> getAll(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String registrationDate
    ) {
        List<Student> Students = getAllStudentUseCase.execute(name, phone, email, description, registrationDate);
        
        List<ResponseStudentDto> response = Students.stream()
                .map(Student -> modelMapper.map(Student, ResponseStudentDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseStudentDto> getById(
            @PathVariable String id) {
        Student Student = getByIdStudentUseCase.execute(id);
        ResponseStudentDto response = modelMapper.map(Student, ResponseStudentDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseStudentDto> update(
            @PathVariable String id,
            @RequestBody @Valid CreateStudentDto updateStudentDto) {
        Student Student = modelMapper.map(updateStudentDto, Student.class);
        
        // Handle many-to-many relationships
        if (updateStudentDto.getInterestAreas() != null) {
            List<InterestArea> interestAreas = updateStudentDto.getInterestAreas().stream()
                .map(relationshipDto -> getByIdInterestAreaUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            Student.setInterestAreas(interestAreas);
        }
        if (updateStudentDto.getSkills() != null) {
            List<Skill> skills = updateStudentDto.getSkills().stream()
                .map(relationshipDto -> getByIdSkillUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            Student.setSkills(skills);
        }
        
        Student updatedStudent = updateStudentUseCase.execute(id, Student);
        ResponseStudentDto response = modelMapper.map(updatedStudent, ResponseStudentDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteStudentUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
