package com.tcc.interestArea.usecase;

import com.tcc.interestArea.adapter.repository.InterestAreaRepository;
import com.tcc.interestArea.entity.InterestArea;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UpdateInterestAreaUseCase {

    private final InterestAreaRepository repository;

    public InterestArea execute(String id, InterestArea updatedInterestArea) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "InterestArea not found with id: " + id);
        }
        
        updatedInterestArea.setId(id);
        return repository.save(updatedInterestArea);
    }
}
