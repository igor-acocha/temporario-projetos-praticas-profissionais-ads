package com.tcc.administrator.usecase;

import com.tcc.administrator.adapter.repository.AdministratorRepository;
import com.tcc.administrator.entity.Administrator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UpdateAdministratorUseCase {

    private final AdministratorRepository repository;

    public Administrator execute(String id, Administrator updatedAdministrator) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Administrator not found with id: " + id);
        }
        
        updatedAdministrator.setId(id);
        return repository.save(updatedAdministrator);
    }
}
