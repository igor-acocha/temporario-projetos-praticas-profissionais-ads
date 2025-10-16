package com.tcc.application.usecase;

import com.tcc.application.adapter.repository.ApplicationRepository;
import com.tcc.application.entity.Application;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UpdateApplicationUseCase {

    private final ApplicationRepository repository;

    public Application execute(String id, Application updatedApplication) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found with id: " + id);
        }
        
        updatedApplication.setId(id);
        return repository.save(updatedApplication);
    }
}
