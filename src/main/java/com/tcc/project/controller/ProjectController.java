package com.tcc.project.controller;

import com.tcc.project.usecase.*;
import com.tcc.project.dto.CreateProjectDto;
import com.tcc.project.dto.ResponseProjectDto;
import com.tcc.project.entity.Project;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ModelMapper modelMapper;

    private final CreateProjectUseCase createProjectUseCase;
    private final GetAllProjectUseCase getAllProjectUseCase;
    private final GetByIdProjectUseCase getByIdProjectUseCase;
    private final UpdateProjectUseCase updateProjectUseCase;
    private final DeleteProjectUseCase deleteProjectUseCase;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CreateProjectDto createProjectDto) {
        Project Project = modelMapper.map(createProjectDto, Project.class);
        
        // Handle composite foreign keys
        
        createProjectUseCase.execute(Project);
        return ResponseEntity.created(null).build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseProjectDto>> getAll(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String creationDate,
            @RequestParam(required = false) String idEntrepreneur
    ) {
        List<Project> Projects = getAllProjectUseCase.execute(title, description, status, creationDate, idEntrepreneur);
        
        List<ResponseProjectDto> response = Projects.stream()
                .map(Project -> modelMapper.map(Project, ResponseProjectDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseProjectDto> getById(
            @PathVariable String id) {
        Project Project = getByIdProjectUseCase.execute(id);
        ResponseProjectDto response = modelMapper.map(Project, ResponseProjectDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseProjectDto> update(
            @PathVariable String id,
            @RequestBody @Valid CreateProjectDto updateProjectDto) {
        Project Project = modelMapper.map(updateProjectDto, Project.class);
        
        Project updatedProject = updateProjectUseCase.execute(id, Project);
        ResponseProjectDto response = modelMapper.map(updatedProject, ResponseProjectDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteProjectUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
