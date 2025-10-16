package com.tcc.user.entity;

import com.tcc.user.entity.TypeProfile;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true)
    private String cpfCnpj;

    @Enumerated(EnumType.STRING)
    private TypeProfile typeProfile; // ESTUDANTE ou EMPREENDEDOR
}
