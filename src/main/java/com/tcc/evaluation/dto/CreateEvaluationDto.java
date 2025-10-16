package com.tcc.evaluation.dto;

import com.tcc.common.dto.RelationshipDto;
import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.Valid;

@Data
public class CreateEvaluationDto {

    @NotNull
    @Valid
    private RelationshipDto project;

    @NotNull
    private Integer score;

    @NotBlank
    private String comment;

    private String evaluationDate;

    @NotBlank
    private String idEvaluator;

    @NotBlank
    private String idEvaluated;

    @NotBlank
    private String evaluatorType;

}
