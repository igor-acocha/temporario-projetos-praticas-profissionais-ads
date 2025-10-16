package com.tcc.project.usecase;

import com.tcc.project.adapter.repository.ProjectRepository;
import com.tcc.project.entity.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UpdateProjectUseCase {

    private final ProjectRepository repository;

    public Project execute(String id, Project updatedProject) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found with id: " + id);
        }
        
        updatedProject.setId(id);
        return repository.save(updatedProject);
    }
}
