package com.tcc.student.usecase;

import com.tcc.student.adapter.repository.StudentRepository;
import com.tcc.student.entity.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.tcc.user.entity.User;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateStudentUseCase {
    private final StudentRepository repository;

    @Transactional
    public void execute(Student student) {
        // Obtém o usuário autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado");
        }
        User user = (User) authentication.getPrincipal();
        // Verifica se já existe perfil para o usuário
        if (repository.findByUser_Id(user.getId()).isPresent()) {
            throw new RuntimeException("Perfil de estudante já existe para este usuário");
        }
        student.setUser(user);
        repository.save(student);
    }
}
