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
    private String requirements;

    @NotNull(message = "O prazo é obrigatório.")
    @Future(message = "O prazo deve ser uma data futura.")
    private java.time.LocalDate deadline;

    @NotBlank
    @Size(min = 300, message = "A descrição deve ter no mínimo 300 caracteres.")
    private String description;

    @NotBlank
    private String status;

    private String creationDate;

}
