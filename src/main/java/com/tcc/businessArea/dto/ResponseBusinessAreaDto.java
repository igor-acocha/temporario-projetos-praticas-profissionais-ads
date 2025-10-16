package com.tcc.businessArea.dto;

import com.tcc.entrepreneur.dto.ResponseEntrepreneurDto;
import java.util.List;
import lombok.Data;

@Data
public class ResponseBusinessAreaDto {

    private String id;
    private String name;
    // Many-to-Many relationships (apenas o lado pai da relação)
    private List<ResponseEntrepreneurDto> entrepreneurs;
}
