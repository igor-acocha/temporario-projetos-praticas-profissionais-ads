package com.tcc.administrator.usecase;

import com.tcc.administrator.adapter.repository.AdministratorRepository;
import com.tcc.administrator.entity.Administrator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateAdministratorUseCase {

    private final AdministratorRepository repository;

    public void execute(Administrator Administrator) {
        repository.save(Administrator);
    }
}
