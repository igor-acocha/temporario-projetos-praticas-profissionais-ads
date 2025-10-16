package com.tcc.student.dto;

import lombok.Data;

@Data
public class ResponseStudentDto {

    private String id;
    private String name;
    private String phone;
    private String email;
    private String description;
    private String registrationDate;
    // Many-to-Many relationships (apenas o lado pai da relação)
}
