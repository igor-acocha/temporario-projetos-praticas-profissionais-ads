package com.tcc.entrepreneur.usecase;

import com.tcc.entrepreneur.adapter.repository.EntrepreneurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DeleteEntrepreneurUseCase {

    private final EntrepreneurRepository repository;

    public void execute(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entrepreneur not found with id: " + id);
        }
        
        repository.deleteById(id);
    }
}
