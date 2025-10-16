package com.tcc.student.usecase;

import com.tcc.student.adapter.repository.StudentRepository;
import com.tcc.student.entity.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateStudentUseCase {

    private final StudentRepository repository;

    public void execute(Student Student) {
        repository.save(Student);
    }
}
