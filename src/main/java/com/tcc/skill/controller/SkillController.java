package com.tcc.skill.controller;

import com.tcc.skill.usecase.*;
import com.tcc.skill.dto.CreateSkillDto;
import com.tcc.skill.dto.ResponseSkillDto;
import com.tcc.skill.entity.Skill;
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
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
public class SkillController {

    private final ModelMapper modelMapper;

    private final CreateSkillUseCase createSkillUseCase;
    private final GetAllSkillUseCase getAllSkillUseCase;
    private final GetByIdSkillUseCase getByIdSkillUseCase;
    private final UpdateSkillUseCase updateSkillUseCase;
    private final DeleteSkillUseCase deleteSkillUseCase;
    
    // Use cases for many-to-many relationships
    private final GetByIdStudentUseCase getByIdStudentUseCase;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CreateSkillDto createSkillDto) {
        Skill Skill = modelMapper.map(createSkillDto, Skill.class);
        
        // Handle composite foreign keys
        
        // Handle many-to-many relationships
        if (createSkillDto.getStudents() != null && !createSkillDto.getStudents().isEmpty()) {
            List<Student> students = createSkillDto.getStudents().stream()
                .map(relationshipDto -> getByIdStudentUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            Skill.setStudents(students);
        }
        
        createSkillUseCase.execute(Skill);
        return ResponseEntity.created(null).build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseSkillDto>> getAll(
            @RequestParam(required = false) String name
    ) {
        List<Skill> Skills = getAllSkillUseCase.execute(name);
        
        List<ResponseSkillDto> response = Skills.stream()
                .map(Skill -> modelMapper.map(Skill, ResponseSkillDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseSkillDto> getById(
            @PathVariable String id) {
        Skill Skill = getByIdSkillUseCase.execute(id);
        ResponseSkillDto response = modelMapper.map(Skill, ResponseSkillDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseSkillDto> update(
            @PathVariable String id,
            @RequestBody @Valid CreateSkillDto updateSkillDto) {
        Skill Skill = modelMapper.map(updateSkillDto, Skill.class);
        
        // Handle many-to-many relationships
        if (updateSkillDto.getStudents() != null) {
            List<Student> students = updateSkillDto.getStudents().stream()
                .map(relationshipDto -> getByIdStudentUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            Skill.setStudents(students);
        }
        
        Skill updatedSkill = updateSkillUseCase.execute(id, Skill);
        ResponseSkillDto response = modelMapper.map(updatedSkill, ResponseSkillDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteSkillUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
