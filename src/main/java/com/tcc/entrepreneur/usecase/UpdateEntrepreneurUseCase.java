package com.tcc.entrepreneur.usecase;

import com.tcc.entrepreneur.adapter.repository.EntrepreneurRepository;
import com.tcc.entrepreneur.entity.Entrepreneur;
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
public class UpdateEntrepreneurUseCase {

    private final EntrepreneurRepository repository;

    public Entrepreneur execute(Entrepreneur updatedEntrepreneur) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        User user = (User) authentication.getPrincipal();
        Optional<Entrepreneur> entrepreneurOpt = repository.findByUser_Id(user.getId());
        if (entrepreneurOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil de empreendedor não encontrado para este usuário");
        }
        Entrepreneur entrepreneur = entrepreneurOpt.get();
        // Atualiza apenas os campos permitidos
        entrepreneur.setCnpj(updatedEntrepreneur.getCnpj());
        entrepreneur.setCompanyName(updatedEntrepreneur.getCompanyName());
        entrepreneur.setDescription(updatedEntrepreneur.getDescription());
        entrepreneur.setEmail(updatedEntrepreneur.getEmail());
        entrepreneur.setPhone(updatedEntrepreneur.getPhone());
        entrepreneur.setRegistrationDate(updatedEntrepreneur.getRegistrationDate());
        entrepreneur.setBusinessAreas(updatedEntrepreneur.getBusinessAreas());
        return repository.save(entrepreneur);
    }
}
