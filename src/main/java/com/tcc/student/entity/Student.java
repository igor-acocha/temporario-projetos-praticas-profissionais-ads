package com.tcc.student.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.List;
import com.tcc.application.entity.Application;
import java.util.ArrayList;
import com.tcc.interestArea.entity.InterestArea;
import com.tcc.skill.entity.Skill;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.tcc.user.entity.User;

@Entity
@Table(name = "student")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Student {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, length = 36)
    private String id;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "phone", nullable = false, length = 50)
    private String phone;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "registration_date")
    private String registrationDate;

    @OneToMany(mappedBy = "idStudent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Application> applications;

    // Relacionamento Many-to-Many simples - LADO INVERSO
    @ManyToMany(mappedBy = "students")
    @JsonBackReference
    private List<InterestArea> interestAreas = new ArrayList<>();

    // Relacionamento Many-to-Many simples - LADO INVERSO
    @ManyToMany(mappedBy = "students")
    @JsonBackReference
    private List<Skill> skills = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Getter e Setter já gerados pelo Lombok
}
