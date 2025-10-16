package com.tcc.administrator.usecase;

import com.tcc.administrator.adapter.repository.AdministratorRepository;
import com.tcc.administrator.entity.Administrator;
import com.tcc.administrator.specification.AdministratorSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetByIdAdministratorUseCase {

    private final AdministratorRepository repository;

    public Administrator execute(String id) {
        return repository.findOne(AdministratorSpecification.build(
                Optional.ofNullable(id),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty()
        )).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrator not found.")
        );
    }
}
