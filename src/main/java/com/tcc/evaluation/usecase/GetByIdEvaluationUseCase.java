package com.tcc.evaluation.usecase;

import com.tcc.evaluation.adapter.repository.EvaluationRepository;
import com.tcc.evaluation.entity.Evaluation;
import com.tcc.evaluation.specification.EvaluationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetByIdEvaluationUseCase {

    private final EvaluationRepository repository;

    public Evaluation execute(String id) {
        return repository.findOne(EvaluationSpecification.build(
                Optional.ofNullable(id),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty()
        )).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evaluation not found.")
        );
    }
}
