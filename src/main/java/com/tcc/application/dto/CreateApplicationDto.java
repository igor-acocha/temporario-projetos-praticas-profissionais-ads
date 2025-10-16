package com.tcc.application.dto;

import com.tcc.common.dto.RelationshipDto;
import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.Valid;

@Data
public class CreateApplicationDto {

    @NotNull
    @Valid
    private RelationshipDto student;

    @NotNull
    @Valid
    private RelationshipDto project;

    private String idea;

    @NotBlank
    private String status;

    private String applicationDate;

}
