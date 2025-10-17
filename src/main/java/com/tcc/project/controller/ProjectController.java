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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.tcc.user.entity.User;
import com.tcc.entrepreneur.adapter.repository.EntrepreneurRepository;
import com.tcc.entrepreneur.entity.Entrepreneur;

import java.util.List;
import java.util.Optional;
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
    private final EntrepreneurRepository entrepreneurRepository;

    @PostMapping
    public ResponseEntity<String> create(@RequestBody @Valid CreateProjectDto createProjectDto) {
        Project project = modelMapper.map(createProjectDto, Project.class);
        try {
            createProjectUseCase.execute(project);
            return ResponseEntity.ok("Projeto cadastrado com sucesso e disponível para estudantes.");
        } catch (org.springframework.web.server.ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar projeto: " + ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ResponseProjectDto>> getAll(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String creationDate
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        User user = (User) authentication.getPrincipal();
        Optional<Entrepreneur> entrepreneurOpt = entrepreneurRepository.findByUser_Id(user.getId());
        if (entrepreneurOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        Entrepreneur entrepreneur = entrepreneurOpt.get();
        List<Project> projects = getAllProjectUseCase.execute(title, description, status, creationDate, entrepreneur.getId());
        List<ResponseProjectDto> response = projects.stream()
                .map(project -> modelMapper.map(project, ResponseProjectDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseProjectDto> getById(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        User user = (User) authentication.getPrincipal();
        Optional<Entrepreneur> entrepreneurOpt = entrepreneurRepository.findByUser_Id(user.getId());
        if (entrepreneurOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        Entrepreneur entrepreneur = entrepreneurOpt.get();
        Project project = getByIdProjectUseCase.execute(id);
        if (!project.getIdEntrepreneur().getId().equals(entrepreneur.getId())) {
            return ResponseEntity.status(403).build();
        }
        ResponseProjectDto response = modelMapper.map(project, ResponseProjectDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseProjectDto> update(@PathVariable String id, @RequestBody @Valid CreateProjectDto updateProjectDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        User user = (User) authentication.getPrincipal();
        Optional<Entrepreneur> entrepreneurOpt = entrepreneurRepository.findByUser_Id(user.getId());
        if (entrepreneurOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        Entrepreneur entrepreneur = entrepreneurOpt.get();
        Project existingProject = getByIdProjectUseCase.execute(id);
        if (!existingProject.getIdEntrepreneur().getId().equals(entrepreneur.getId())) {
            return ResponseEntity.status(403).build();
        }
        Project updatedProject = modelMapper.map(updateProjectDto, Project.class);
        updatedProject.setId(id);
        updatedProject.setIdEntrepreneur(entrepreneur);
        Project savedProject = updateProjectUseCase.execute(id, updatedProject);
        ResponseProjectDto response = modelMapper.map(savedProject, ResponseProjectDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        User user = (User) authentication.getPrincipal();
        Optional<Entrepreneur> entrepreneurOpt = entrepreneurRepository.findByUser_Id(user.getId());
        if (entrepreneurOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        Entrepreneur entrepreneur = entrepreneurOpt.get();
        Project project = getByIdProjectUseCase.execute(id);
        if (!project.getIdEntrepreneur().getId().equals(entrepreneur.getId())) {
            return ResponseEntity.status(403).build();
        }
        deleteProjectUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
