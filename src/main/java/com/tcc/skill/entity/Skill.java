package com.tcc.skill.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.List;
import java.util.ArrayList;
import com.tcc.student.entity.Student;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "skill")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Skill {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, length = 36)
    private String id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    // Relacionamento Many-to-Many simples - DONO da relação
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinTable(
        name = "student_skill",
        joinColumns = @JoinColumn(name = "id_skill"),
        inverseJoinColumns = @JoinColumn(name = "id_student")
    )
    @JsonManagedReference
    private List<Student> students = new ArrayList<>();

}
