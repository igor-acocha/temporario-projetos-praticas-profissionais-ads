package com.tcc.administrator.usecase;

import com.tcc.administrator.adapter.repository.AdministratorRepository;
import com.tcc.administrator.entity.Administrator;
import com.tcc.administrator.specification.AdministratorSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class GetAllAdministratorUseCase {

    private final AdministratorRepository repository;

    public List<Administrator> execute(String name, String email, String password, String creationDate) {
        return repository.findAll(
                AdministratorSpecification.build(
                        Optional.empty(),
                        Optional.ofNullable(name),
                        Optional.ofNullable(email),
                        Optional.ofNullable(password),
                        Optional.ofNullable(creationDate)
                )
        );
    }
}
