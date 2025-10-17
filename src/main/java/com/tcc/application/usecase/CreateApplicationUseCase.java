package com.tcc.application.usecase;

import com.tcc.application.adapter.repository.ApplicationRepository;
import com.tcc.application.entity.Application;
import com.tcc.project.adapter.repository.ProjectRepository;
import com.tcc.student.entity.Student;
import com.tcc.project.entity.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class CreateApplicationUseCase {

    private final ApplicationRepository repository;
    @Autowired
    private ProjectRepository projectRepository;

    public void execute(Application application) {
        // Validação: projeto existe
        Project project = application.getIdProject();
        if (project == null || !projectRepository.existsById(project.getId())) {
            throw new IllegalArgumentException("Projeto não encontrado.");
        }
        // Validação: descrição obrigatória e mínimo de caracteres
        String idea = application.getIdea();
        if (idea == null || idea.trim().length() < 300) {
            throw new IllegalArgumentException("Descrição obrigatória com mínimo de 300 caracteres.");
        }
        // Validação: apenas uma ideia por estudante/projeto
        Student student = application.getIdStudent();
        if (student == null || repository.findByIdStudentIdAndIdProjectId(student.getId(), project.getId()).isPresent()) {
            throw new IllegalArgumentException("Já existe uma ideia vinculada a este projeto por este estudante.");
        }
        // Definir status inicial e data da aplicação
        application.setStatus("PENDENTE");
        application.setApplicationDate(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        repository.save(application);
    }
}
