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
    public ResponseEntity<String> create(@RequestBody @Valid CreateEntrepreneurDto createEntrepreneurDto) {
        Entrepreneur entrepreneur = modelMapper.map(createEntrepreneurDto, Entrepreneur.class);
        if (createEntrepreneurDto.getBusinessAreas() != null && !createEntrepreneurDto.getBusinessAreas().isEmpty()) {
            List<BusinessArea> businessAreas = createEntrepreneurDto.getBusinessAreas().stream()
                .map(relationshipDto -> getByIdBusinessAreaUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            entrepreneur.setBusinessAreas(businessAreas);
        }
        try {
            createEntrepreneurUseCase.execute(entrepreneur);
            return ResponseEntity.status(HttpStatus.CREATED).body("Perfil criado com sucesso.");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
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

    @PutMapping("/profile")
    public ResponseEntity<String> update(@RequestBody @Valid CreateEntrepreneurDto updateEntrepreneurDto) {
        Entrepreneur entrepreneur = modelMapper.map(updateEntrepreneurDto, Entrepreneur.class);
        // Trata relacionamentos muitos-para-muitos
        if (updateEntrepreneurDto.getBusinessAreas() != null && !updateEntrepreneurDto.getBusinessAreas().isEmpty()) {
            List<BusinessArea> businessAreas = updateEntrepreneurDto.getBusinessAreas().stream()
                .map(relationshipDto -> getByIdBusinessAreaUseCase.execute(relationshipDto.getId()))
                .collect(Collectors.toList());
            entrepreneur.setBusinessAreas(businessAreas);
        }
        try {
            updateEntrepreneurUseCase.execute(entrepreneur);
            return ResponseEntity.ok("Perfil atualizado com sucesso.");
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro ao atualizar perfil: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteEntrepreneurUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
