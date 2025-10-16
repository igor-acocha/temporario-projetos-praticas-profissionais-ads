package com.tcc.evaluation.usecase;

import com.tcc.evaluation.adapter.repository.EvaluationRepository;
import com.tcc.evaluation.entity.Evaluation;
import com.tcc.evaluation.specification.EvaluationSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class GetAllEvaluationUseCase {

    private final EvaluationRepository repository;

    public List<Evaluation> execute(Integer score, String comment, String evaluationDate, String idProject, String idEvaluator, String idEvaluated, String evaluatorType) {
        return repository.findAll(
                EvaluationSpecification.build(
                        Optional.empty(),
                        Optional.ofNullable(score),
                        Optional.ofNullable(comment),
                        Optional.ofNullable(evaluationDate),
                        Optional.ofNullable(idProject),
                        Optional.ofNullable(idEvaluator),
                        Optional.ofNullable(idEvaluated),
                        Optional.ofNullable(evaluatorType)
                )
        );
    }
}
