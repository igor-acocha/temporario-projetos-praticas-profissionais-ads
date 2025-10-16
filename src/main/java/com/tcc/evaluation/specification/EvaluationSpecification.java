package com.tcc.evaluation.specification;

import com.tcc.common.specification.GenericSpecBuilder;
import com.tcc.evaluation.entity.Evaluation;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;


public final class EvaluationSpecification {

    private EvaluationSpecification() {}

    public static Specification<Evaluation> build(
            Optional<String> idOptional,
            Optional<Integer> scoreOptional,
            Optional<String> commentOptional,
            Optional<String> evaluationDateOptional,
            Optional<String> idProjectOptional,
            Optional<String> idEvaluatorOptional,
            Optional<String> idEvaluatedOptional,
            Optional<String> evaluatorTypeOptional
    ) {
        GenericSpecBuilder<Evaluation> builder = new GenericSpecBuilder<>();

        idOptional.ifPresent(id -> builder.with("id", "=", id));
        scoreOptional.ifPresent(score -> builder.with("score", "=", score));
                commentOptional.ifPresent(comment -> builder.with("comment", "like", comment));
        evaluationDateOptional.ifPresent(evaluationDate -> builder.with("evaluationDate", "like", evaluationDate));
        idProjectOptional.ifPresent(idProject -> builder.with("idProject.id", "=", idProject));
        idEvaluatorOptional.ifPresent(idEvaluator -> builder.with("idEvaluator", "like", idEvaluator));
        idEvaluatedOptional.ifPresent(idEvaluated -> builder.with("idEvaluated", "like", idEvaluated));
        evaluatorTypeOptional.ifPresent(evaluatorType -> builder.with("evaluatorType", "like", evaluatorType));

        return builder.build();
    }
}
