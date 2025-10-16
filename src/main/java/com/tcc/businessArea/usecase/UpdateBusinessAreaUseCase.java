package com.tcc.businessArea.usecase;

import com.tcc.businessArea.adapter.repository.BusinessAreaRepository;
import com.tcc.businessArea.entity.BusinessArea;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UpdateBusinessAreaUseCase {

    private final BusinessAreaRepository repository;

    public BusinessArea execute(String id, BusinessArea updatedBusinessArea) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "BusinessArea not found with id: " + id);
        }
        
        updatedBusinessArea.setId(id);
        return repository.save(updatedBusinessArea);
    }
}
