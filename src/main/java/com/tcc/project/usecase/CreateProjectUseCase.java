package com.tcc.project.usecase;

import com.tcc.project.adapter.repository.ProjectRepository;
import com.tcc.project.entity.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateProjectUseCase {

    private final ProjectRepository repository;

    public void execute(Project Project) {
        repository.save(Project);
    }
}
