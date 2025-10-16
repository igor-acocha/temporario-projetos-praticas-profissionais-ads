package com.tcc.student.usecase;

import com.tcc.student.adapter.repository.StudentRepository;
import com.tcc.student.entity.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UpdateStudentUseCase {

    private final StudentRepository repository;

    public Student execute(String id, Student updatedStudent) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found with id: " + id);
        }
        
        updatedStudent.setId(id);
        return repository.save(updatedStudent);
    }
}
