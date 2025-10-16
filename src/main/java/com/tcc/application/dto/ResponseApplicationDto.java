package com.tcc.application.dto;

import com.tcc.student.dto.ResponseStudentDto;
import com.tcc.project.dto.ResponseProjectDto;
import lombok.Data;

@Data
public class ResponseApplicationDto {

    private String id;
    private ResponseStudentDto student;
    private ResponseProjectDto project;
    private String idea;
    private String status;
    private String applicationDate;
}
