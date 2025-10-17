package com.tcc.entrepreneur.usecase;

import com.tcc.entrepreneur.adapter.repository.EntrepreneurRepository;
import com.tcc.entrepreneur.entity.Entrepreneur;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import com.tcc.user.entity.User;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateEntrepreneurUseCase {
    private final EntrepreneurRepository repository;

    @Transactional
    public void execute(Entrepreneur entrepreneur) {
        // Obtém o usuário autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado");
        }
        User user = (User) authentication.getPrincipal();
        // Verifica se já existe perfil para o usuário
        if (repository.findByUser_Id(user.getId()).isPresent()) {
            throw new RuntimeException("Perfil de empreendedor já existe para este usuário");
        }
        entrepreneur.setUser(user);
        repository.save(entrepreneur);
    }
}
