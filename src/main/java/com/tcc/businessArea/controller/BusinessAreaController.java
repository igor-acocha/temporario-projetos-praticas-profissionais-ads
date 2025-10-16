package com.tcc.businessArea.controller;

import com.tcc.businessArea.usecase.*;
import com.tcc.businessArea.dto.CreateBusinessAreaDto;
import com.tcc.businessArea.dto.ResponseBusinessAreaDto;
import com.tcc.businessArea.entity.BusinessArea;
import com.tcc.entrepreneur.usecase.GetByIdEntrepreneurUseCase;
import com.tcc.entrepreneur.entity.Entrepreneur;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/business-areas")
@RequiredArgsConstructor
public class BusinessAreaController {

    private final ModelMapper modelMapper;

    private final CreateBusinessAreaUseCase createBusinessAreaUseCase;
    private final GetAllBusinessAreaUseCase getAllBusinessAreaUseCase;
    private final GetByIdBusinessAreaUseCase getByIdBusinessAreaUseCase;
    private final UpdateBusinessAreaUseCase updateBusinessAreaUseCase;
    private final DeleteBusinessAreaUseCase deleteBusinessAreaUseCase;
    
    // Use cases for many-to-many relationships
    private final GetByIdEntrepreneurUseCase getByIdEntrepreneurUseCase;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CreateBusinessAreaDto createBusinessAreaDto) {
        BusinessArea BusinessArea = modelMapper.map(createBusinessAreaDto, BusinessArea.class);
        
        // Handle composite foreign keys
        
        // Handle many-to-many relationships
        if (createBusinessAreaDto.getEntrepreneurs() != null && !createBusinessAreaDto.getEntrepreneurs().isEmpty()) {
            List<Entrepreneur> entrepreneurs = createBusinessAreaDto.getEntrepreneurs().stream()
                .map(relationshipDto -> getByIdEntrepreneurUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            BusinessArea.setEntrepreneurs(entrepreneurs);
        }
        
        createBusinessAreaUseCase.execute(BusinessArea);
        return ResponseEntity.created(null).build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseBusinessAreaDto>> getAll(
            @RequestParam(required = false) String name
    ) {
        List<BusinessArea> BusinessAreas = getAllBusinessAreaUseCase.execute(name);
        
        List<ResponseBusinessAreaDto> response = BusinessAreas.stream()
                .map(BusinessArea -> modelMapper.map(BusinessArea, ResponseBusinessAreaDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseBusinessAreaDto> getById(
            @PathVariable String id) {
        BusinessArea BusinessArea = getByIdBusinessAreaUseCase.execute(id);
        ResponseBusinessAreaDto response = modelMapper.map(BusinessArea, ResponseBusinessAreaDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseBusinessAreaDto> update(
            @PathVariable String id,
            @RequestBody @Valid CreateBusinessAreaDto updateBusinessAreaDto) {
        BusinessArea BusinessArea = modelMapper.map(updateBusinessAreaDto, BusinessArea.class);
        
        // Handle many-to-many relationships
        if (updateBusinessAreaDto.getEntrepreneurs() != null) {
            List<Entrepreneur> entrepreneurs = updateBusinessAreaDto.getEntrepreneurs().stream()
                .map(relationshipDto -> getByIdEntrepreneurUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            BusinessArea.setEntrepreneurs(entrepreneurs);
        }
        
        BusinessArea updatedBusinessArea = updateBusinessAreaUseCase.execute(id, BusinessArea);
        ResponseBusinessAreaDto response = modelMapper.map(updatedBusinessArea, ResponseBusinessAreaDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteBusinessAreaUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
