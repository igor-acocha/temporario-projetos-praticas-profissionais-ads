package com.tcc.student.usecase;

import com.tcc.student.adapter.repository.StudentRepository;
import com.tcc.student.entity.Student;
import com.tcc.student.specification.StudentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetByIdStudentUseCase {

    private final StudentRepository repository;

    public Student execute(String id) {
        return repository.findOne(StudentSpecification.build(
                Optional.ofNullable(id),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty()
        )).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found.")
        );
    }
}
