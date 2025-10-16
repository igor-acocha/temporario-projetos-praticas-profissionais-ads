package com.tcc.skill.dto;

import com.tcc.common.dto.RelationshipDto;
import java.util.List;
import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.Valid;

@Data
public class CreateSkillDto {

    @NotBlank
    private String name;

    // Many-to-Many relationships
    @Valid
    private List<RelationshipDto> students;

}
