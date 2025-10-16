package com.tcc.project.usecase;

import com.tcc.project.adapter.repository.ProjectRepository;
import com.tcc.project.entity.Project;
import com.tcc.project.specification.ProjectSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetByIdProjectUseCase {

    private final ProjectRepository repository;

    public Project execute(String id) {
        return repository.findOne(ProjectSpecification.build(
                Optional.ofNullable(id),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty()
        )).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found.")
        );
    }
}
