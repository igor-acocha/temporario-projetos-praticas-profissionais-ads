package com.tcc.evaluation.dto;

import com.tcc.project.dto.ResponseProjectDto;
import lombok.Data;

@Data
public class ResponseEvaluationDto {

    private String id;
    private ResponseProjectDto project;
    private Integer score;
    private String comment;
    private String evaluationDate;
    private String idEvaluator;
    private String idEvaluated;
    private String evaluatorType;
}
