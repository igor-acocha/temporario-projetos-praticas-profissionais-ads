package com.tcc.entrepreneur.dto;

import lombok.Data;

@Data
public class ResponseEntrepreneurDto {

    private String id;
    private String cnpj;
    private String companyName;
    private String description;
    private String email;
    private String phone;
    private String registrationDate;
    // Many-to-Many relationships (apenas o lado pai da relação)
}
