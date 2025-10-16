package com.tcc.evaluation.usecase;

import com.tcc.evaluation.adapter.repository.EvaluationRepository;
import com.tcc.evaluation.entity.Evaluation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UpdateEvaluationUseCase {

    private final EvaluationRepository repository;

    public Evaluation execute(String id, Evaluation updatedEvaluation) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evaluation not found with id: " + id);
        }
        
        updatedEvaluation.setId(id);
        return repository.save(updatedEvaluation);
    }
}
