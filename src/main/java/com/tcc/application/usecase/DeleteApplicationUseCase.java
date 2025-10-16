package com.tcc.application.usecase;

import com.tcc.application.adapter.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DeleteApplicationUseCase {

    private final ApplicationRepository repository;

    public void execute(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found with id: " + id);
        }
        
        repository.deleteById(id);
    }
}
