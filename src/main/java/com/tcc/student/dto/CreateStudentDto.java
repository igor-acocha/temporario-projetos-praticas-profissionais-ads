package com.tcc.student.dto;

import com.tcc.common.dto.RelationshipDto;
import java.util.List;
import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.Valid;

@Data
public class CreateStudentDto {

    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    @NotBlank
    private String email;

    @NotBlank
    private String description;

    private String registrationDate;

    // Many-to-Many relationships
    @Valid
    private List<RelationshipDto> interestAreas;

    @Valid
    private List<RelationshipDto> skills;

}
