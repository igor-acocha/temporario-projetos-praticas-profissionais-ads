package com.tcc.evaluation.controller;

import com.tcc.evaluation.usecase.*;
import com.tcc.evaluation.dto.CreateEvaluationDto;
import com.tcc.evaluation.dto.ResponseEvaluationDto;
import com.tcc.evaluation.entity.Evaluation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/evaluations")
@RequiredArgsConstructor
public class EvaluationController {

    private final ModelMapper modelMapper;

    private final CreateEvaluationUseCase createEvaluationUseCase;
    private final GetAllEvaluationUseCase getAllEvaluationUseCase;
    private final GetByIdEvaluationUseCase getByIdEvaluationUseCase;
    private final UpdateEvaluationUseCase updateEvaluationUseCase;
    private final DeleteEvaluationUseCase deleteEvaluationUseCase;

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody @Valid CreateEvaluationDto createEvaluationDto) {
        Evaluation Evaluation = modelMapper.map(createEvaluationDto, Evaluation.class);

        // Handle composite foreign keys

        createEvaluationUseCase.execute(Evaluation);
        return ResponseEntity.created(null).build();
    }

    @GetMapping
    public ResponseEntity<List<ResponseEvaluationDto>> getAll(
            @RequestParam(required = false) Integer score,
            @RequestParam(required = false) String comment,
            @RequestParam(required = false) String evaluationDate,
            @RequestParam(required = false) String idProject,
            @RequestParam(required = false) String idEvaluator,
            @RequestParam(required = false) String idEvaluated,
            @RequestParam(required = false) String evaluatorType
    ) {
        List<Evaluation> Evaluations = getAllEvaluationUseCase.execute(score, comment, evaluationDate, idProject, idEvaluator, idEvaluated, evaluatorType);

        List<ResponseEvaluationDto> response = Evaluations.stream()
                .map(Evaluation -> modelMapper.map(Evaluation, ResponseEvaluationDto.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseEvaluationDto> getById(
            @PathVariable String id) {
        Evaluation Evaluation = getByIdEvaluationUseCase.execute(id);
        ResponseEvaluationDto response = modelMapper.map(Evaluation, ResponseEvaluationDto.class);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseEvaluationDto> update(
            @PathVariable String id,
            @RequestBody @Valid CreateEvaluationDto updateEvaluationDto) {
        Evaluation Evaluation = modelMapper.map(updateEvaluationDto, Evaluation.class);

        Evaluation updatedEvaluation = updateEvaluationUseCase.execute(id, Evaluation);
        ResponseEvaluationDto response = modelMapper.map(updatedEvaluation, ResponseEvaluationDto.class);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id) {
        deleteEvaluationUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
