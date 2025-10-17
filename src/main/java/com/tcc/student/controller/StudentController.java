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
    public ResponseEntity<String> create(@RequestBody @Valid CreateStudentDto createStudentDto) {
        Student student = modelMapper.map(createStudentDto, Student.class);
        if (createStudentDto.getInterestAreas() != null && !createStudentDto.getInterestAreas().isEmpty()) {
            List<InterestArea> interestAreas = createStudentDto.getInterestAreas().stream()
                .map(relationshipDto -> getByIdInterestAreaUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            student.setInterestAreas(interestAreas);
        }
        if (createStudentDto.getSkills() != null && !createStudentDto.getSkills().isEmpty()) {
            List<Skill> skills = createStudentDto.getSkills().stream()
                .map(relationshipDto -> getByIdSkillUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            student.setSkills(skills);
        }
        try {
            createStudentUseCase.execute(student);
            return ResponseEntity.status(HttpStatus.CREATED).body("Perfil criado com sucesso.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
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

    @PutMapping("/profile")
    public ResponseEntity<String> update(@RequestBody @Valid CreateStudentDto updateStudentDto) {
        Student student = modelMapper.map(updateStudentDto, Student.class);
        // Trata relacionamentos muitos-para-muitos
        if (updateStudentDto.getInterestAreas() != null && !updateStudentDto.getInterestAreas().isEmpty()) {
            List<InterestArea> interestAreas = updateStudentDto.getInterestAreas().stream()
                .map(relationshipDto -> getByIdInterestAreaUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            student.setInterestAreas(interestAreas);
        }
        if (updateStudentDto.getSkills() != null && !updateStudentDto.getSkills().isEmpty()) {
            List<Skill> skills = updateStudentDto.getSkills().stream()
                .map(relationshipDto -> getByIdSkillUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            student.setSkills(skills);
        }
        try {
            updateStudentUseCase.execute(student);
            return ResponseEntity.ok("Perfil atualizado com sucesso.");
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao atualizar perfil: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteStudentUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
