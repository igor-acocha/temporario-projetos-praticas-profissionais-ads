package com.tcc.administrator.dto;

import lombok.Data;

@Data
public class ResponseAdministratorDto {

    private String id;
    private String name;
    private String email;
    private String password;
    private String creationDate;
}
