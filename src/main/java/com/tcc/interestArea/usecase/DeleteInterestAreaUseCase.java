package com.tcc.interestArea.usecase;

import com.tcc.interestArea.adapter.repository.InterestAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DeleteInterestAreaUseCase {

    private final InterestAreaRepository repository;

    public void execute(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "InterestArea not found with id: " + id);
        }
        
        repository.deleteById(id);
    }
}
