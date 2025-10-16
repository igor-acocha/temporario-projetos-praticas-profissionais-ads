package com.tcc.evaluation.adapter.repository;

import com.tcc.evaluation.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EvaluationRepository extends JpaRepository<Evaluation, String>, JpaSpecificationExecutor<Evaluation> {
}
