package com.tcc.businessArea.dto;

import com.tcc.common.dto.RelationshipDto;
import java.util.List;
import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.Valid;

@Data
public class CreateBusinessAreaDto {

    @NotBlank
    private String name;

    // Many-to-Many relationships
    @Valid
    private List<RelationshipDto> entrepreneurs;

}
