package com.tcc.entrepreneur.dto;

import com.tcc.common.dto.RelationshipDto;
import java.util.List;
import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.Valid;

@Data
public class CreateEntrepreneurDto {

    private String cnpj;

    @NotBlank
    private String companyName;

    @NotBlank
    private String description;

    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    private String registrationDate;

    // Many-to-Many relationships
    @Valid
    private List<RelationshipDto> businessAreas;

}
