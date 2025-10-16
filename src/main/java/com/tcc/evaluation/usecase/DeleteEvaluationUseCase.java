package com.tcc.evaluation.usecase;

import com.tcc.evaluation.adapter.repository.EvaluationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DeleteEvaluationUseCase {

    private final EvaluationRepository repository;

    public void execute(String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evaluation not found with id: " + id);
        }
        
        repository.deleteById(id);
    }
}
