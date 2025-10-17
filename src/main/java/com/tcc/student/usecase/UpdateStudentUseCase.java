package com.tcc.student.usecase;

import com.tcc.student.adapter.repository.StudentRepository;
import com.tcc.student.entity.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.tcc.user.entity.User;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateStudentUseCase {

    private final StudentRepository repository;

    public Student execute(Student updatedStudent) {
        // Obtém o usuário autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        User user = (User) authentication.getPrincipal();
        Optional<Student> studentOpt = repository.findByUser_Id(user.getId());
        if (studentOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de estudante não encontrado para este usuário");
        }
        Student student = studentOpt.get();
        // Atualiza apenas os campos permitidos
        student.setName(updatedStudent.getName());
        student.setPhone(updatedStudent.getPhone());
        student.setEmail(updatedStudent.getEmail());
        student.setDescription(updatedStudent.getDescription());
        student.setRegistrationDate(updatedStudent.getRegistrationDate());
        student.setInterestAreas(updatedStudent.getInterestAreas());
        student.setSkills(updatedStudent.getSkills());
        return repository.save(student);
    }
}
