package com.tcc.student.usecase;

import com.tcc.student.adapter.repository.StudentRepository;
import com.tcc.student.entity.Student;
import com.tcc.student.specification.StudentSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class GetAllStudentUseCase {

    private final StudentRepository repository;

    public List<Student> execute(String name, String phone, String email, String description, String registrationDate) {
        return repository.findAll(
                StudentSpecification.build(
                        Optional.empty(),
                        Optional.ofNullable(name),
                        Optional.ofNullable(phone),
                        Optional.ofNullable(email),
                        Optional.ofNullable(description),
                        Optional.ofNullable(registrationDate)
                )
        );
    }
}
