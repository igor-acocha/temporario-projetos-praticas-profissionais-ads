package com.tcc.project.usecase;

import com.tcc.project.adapter.repository.ProjectRepository;
import com.tcc.project.entity.Project;
import com.tcc.entrepreneur.adapter.repository.EntrepreneurRepository;
import com.tcc.entrepreneur.entity.Entrepreneur;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.tcc.user.entity.User;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateProjectUseCase {
    private final ProjectRepository repository;
    private final EntrepreneurRepository entrepreneurRepository;

    public void execute(Project project) {
        // Verifica se o empreendedor está autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        User user = (User) authentication.getPrincipal();
        Optional<Entrepreneur> entrepreneurOpt = entrepreneurRepository.findByUser_Id(user.getId());
        if (entrepreneurOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de empreendedor não encontrado");
        }
        Entrepreneur entrepreneur = entrepreneurOpt.get();
        // Validação de perfil completo (exemplo: nome, email, cnpj, etc)
        if (entrepreneur.getCompanyName() == null || entrepreneur.getCompanyName().isBlank() || entrepreneur.getEmail() == null || entrepreneur.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Complete seu perfil de empreendedor antes de cadastrar projetos.");
        }
        // Associa o projeto ao empreendedor autenticado
        project.setIdEntrepreneur(entrepreneur);
        repository.save(project);
    }
}
