package com.tcc.administrator.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import lombok.*;

@Entity
@Table(name = "administrator")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Administrator {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, length = 36)
    private String id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "creation_date")
    private String creationDate;

}
