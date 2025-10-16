package com.tcc.evaluation.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import com.tcc.project.entity.Project;
import lombok.*;

@Entity
@Table(name = "evaluation")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Evaluation {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, length = 36)
    private String id;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "comment", nullable = false)
    private String comment;

    @Column(name = "evaluation_date")
    private String evaluationDate;

    @Column(name = "id_evaluator", nullable = false, length = 36)
    private String idEvaluator;

    @Column(name = "id_evaluated", nullable = false, length = 36)
    private String idEvaluated;

    @Column(name = "evaluator_type", nullable = false)
    private String evaluatorType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_project")
    private Project idProject;

}
