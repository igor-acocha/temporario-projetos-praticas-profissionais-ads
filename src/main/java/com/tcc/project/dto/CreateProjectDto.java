package com.tcc.project.dto;

import com.tcc.common.dto.RelationshipDto;
import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.Valid;

@Data
public class CreateProjectDto {

    @NotNull
    @Valid
    private RelationshipDto entrepreneur;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String status;

    private String creationDate;

}
