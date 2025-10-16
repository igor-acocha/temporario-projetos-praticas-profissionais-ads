package com.tcc.application.usecase;

import com.tcc.application.adapter.repository.ApplicationRepository;
import com.tcc.application.entity.Application;
import com.tcc.application.specification.ApplicationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class GetAllApplicationUseCase {

    private final ApplicationRepository repository;

    public List<Application> execute(String idea, String status, String applicationDate, String idStudent, String idProject) {
        return repository.findAll(
                ApplicationSpecification.build(
                        Optional.empty(),
                        Optional.ofNullable(idea),
                        Optional.ofNullable(status),
                        Optional.ofNullable(applicationDate),
                        Optional.ofNullable(idStudent),
                        Optional.ofNullable(idProject)
                )
        );
    }
}
