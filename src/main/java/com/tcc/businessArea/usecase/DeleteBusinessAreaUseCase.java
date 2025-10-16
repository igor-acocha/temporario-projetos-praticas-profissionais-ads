package com.tcc.businessArea.usecase;

import com.tcc.businessArea.adapter.repository.BusinessAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DeleteBusinessAreaUseCase {

    private final BusinessAreaRepository repository;

    public void execute(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "BusinessArea not found with id: " + id);
        }
        
        repository.deleteById(id);
    }
}
