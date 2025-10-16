package com.tcc.user.adapter.security;

import com.tcc.user.adapter.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

/**
 * ADAPTADOR que conecta o UserRepository com o mecanismo de autenticação do Spring Security.
 * A anotação @Component a torna um "bean" gerenciável pelo Spring, similar a @Service,
 * mas usamos @Component para indicar que é um componente genérico de infraestrutura.
 */
@Component
public class UserDetailsAdapter implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsAdapter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Este método é chamado pelo Spring Security durante a validação do token JWT
     * para carregar os detalhes do usuário a partir do banco de dados.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Usa o repositório para buscar o usuário pelo e-mail (que é o nosso "username")
        com.tcc.user.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + email));

        // Converte a nossa entidade User para a classe User que o Spring Security entende
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // Futuramente, aqui podem ser carregadas as permissões (roles) do usuário
        );
    }
}
