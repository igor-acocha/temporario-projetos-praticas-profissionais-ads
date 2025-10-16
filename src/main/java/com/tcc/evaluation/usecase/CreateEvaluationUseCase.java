package com.tcc.evaluation.usecase;

import com.tcc.evaluation.adapter.repository.EvaluationRepository;
import com.tcc.evaluation.entity.Evaluation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateEvaluationUseCase {

    private final EvaluationRepository repository;

    public void execute(Evaluation Evaluation) {
        repository.save(Evaluation);
    }
}
