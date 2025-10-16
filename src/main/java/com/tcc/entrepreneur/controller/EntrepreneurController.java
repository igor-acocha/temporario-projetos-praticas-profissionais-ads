package com.tcc.entrepreneur.controller;

import com.tcc.entrepreneur.usecase.*;
import com.tcc.entrepreneur.dto.CreateEntrepreneurDto;
import com.tcc.entrepreneur.dto.ResponseEntrepreneurDto;
import com.tcc.entrepreneur.entity.Entrepreneur;
import com.tcc.businessArea.usecase.GetByIdBusinessAreaUseCase;
import com.tcc.businessArea.entity.BusinessArea;
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
@RequestMapping("/api/v1/entrepreneurs")
@RequiredArgsConstructor
public class EntrepreneurController {

    private final ModelMapper modelMapper;

    private final CreateEntrepreneurUseCase createEntrepreneurUseCase;
    private final GetAllEntrepreneurUseCase getAllEntrepreneurUseCase;
    private final GetByIdEntrepreneurUseCase getByIdEntrepreneurUseCase;
    private final UpdateEntrepreneurUseCase updateEntrepreneurUseCase;
    private final DeleteEntrepreneurUseCase deleteEntrepreneurUseCase;
    
    // Use cases for many-to-many relationships
    private final GetByIdBusinessAreaUseCase getByIdBusinessAreaUseCase;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CreateEntrepreneurDto createEntrepreneurDto) {
        Entrepreneur Entrepreneur = modelMapper.map(createEntrepreneurDto, Entrepreneur.class);
        
        // Handle composite foreign keys
        
        // Handle many-to-many relationships
        if (createEntrepreneurDto.getBusinessAreas() != null && !createEntrepreneurDto.getBusinessAreas().isEmpty()) {
            List<BusinessArea> businessAreas = createEntrepreneurDto.getBusinessAreas().stream()
                .map(relationshipDto -> getByIdBusinessAreaUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            Entrepreneur.setBusinessAreas(businessAreas);
        }
        
        createEntrepreneurUseCase.execute(Entrepreneur);
        return ResponseEntity.created(null).build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseEntrepreneurDto>> getAll(
            @RequestParam(required = false) String cnpj,
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String registrationDate
    ) {
        List<Entrepreneur> Entrepreneurs = getAllEntrepreneurUseCase.execute(cnpj, companyName, description, email, phone, registrationDate);
        
        List<ResponseEntrepreneurDto> response = Entrepreneurs.stream()
                .map(Entrepreneur -> modelMapper.map(Entrepreneur, ResponseEntrepreneurDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseEntrepreneurDto> getById(
            @PathVariable String id) {
        Entrepreneur Entrepreneur = getByIdEntrepreneurUseCase.execute(id);
        ResponseEntrepreneurDto response = modelMapper.map(Entrepreneur, ResponseEntrepreneurDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseEntrepreneurDto> update(
            @PathVariable String id,
            @RequestBody @Valid CreateEntrepreneurDto updateEntrepreneurDto) {
        Entrepreneur Entrepreneur = modelMapper.map(updateEntrepreneurDto, Entrepreneur.class);
        
        // Handle many-to-many relationships
        if (updateEntrepreneurDto.getBusinessAreas() != null) {
            List<BusinessArea> businessAreas = updateEntrepreneurDto.getBusinessAreas().stream()
                .map(relationshipDto -> getByIdBusinessAreaUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            Entrepreneur.setBusinessAreas(businessAreas);
        }
        
        Entrepreneur updatedEntrepreneur = updateEntrepreneurUseCase.execute(id, Entrepreneur);
        ResponseEntrepreneurDto response = modelMapper.map(updatedEntrepreneur, ResponseEntrepreneurDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteEntrepreneurUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
