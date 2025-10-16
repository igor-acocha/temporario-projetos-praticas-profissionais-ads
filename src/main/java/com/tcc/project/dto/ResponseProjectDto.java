package com.tcc.project.dto;

import com.tcc.entrepreneur.dto.ResponseEntrepreneurDto;
import lombok.Data;

@Data
public class ResponseProjectDto {

    private String id;
    private ResponseEntrepreneurDto entrepreneur;
    private String title;
    private String description;
    private String status;
    private String creationDate;
}
