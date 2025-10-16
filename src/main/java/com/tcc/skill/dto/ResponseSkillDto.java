package com.tcc.skill.dto;

import com.tcc.student.dto.ResponseStudentDto;
import java.util.List;
import lombok.Data;

@Data
public class ResponseSkillDto {

    private String id;
    private String name;
    // Many-to-Many relationships (apenas o lado pai da relação)
    private List<ResponseStudentDto> students;
}
