package com.tcc.entrepreneur.usecase;

import com.tcc.entrepreneur.adapter.repository.EntrepreneurRepository;
import com.tcc.entrepreneur.entity.Entrepreneur;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UpdateEntrepreneurUseCase {

    private final EntrepreneurRepository repository;

    public Entrepreneur execute(String id, Entrepreneur updatedEntrepreneur) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entrepreneur not found with id: " + id);
        }
        
        updatedEntrepreneur.setId(id);
        return repository.save(updatedEntrepreneur);
    }
}
