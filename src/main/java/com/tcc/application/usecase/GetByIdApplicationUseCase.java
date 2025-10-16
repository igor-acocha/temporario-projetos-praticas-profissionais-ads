package com.tcc.application.usecase;

import com.tcc.application.adapter.repository.ApplicationRepository;
import com.tcc.application.entity.Application;
import com.tcc.application.specification.ApplicationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetByIdApplicationUseCase {

    private final ApplicationRepository repository;

    public Application execute(String id) {
        return repository.findOne(ApplicationSpecification.build(
                Optional.ofNullable(id),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty()
        )).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found.")
        );
    }
}
