package com.tcc.application.entity;

import com.tcc.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import com.tcc.student.entity.Student;
import com.tcc.project.entity.Project;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "application")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Application {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, length = 36)
    private String id;

    @Column(name = "idea")
    private String idea;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "application_date")
    private LocalDateTime applicationDate;

    @Column(name = "value", nullable = false)
    private Double value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    private User idUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_project")
    private Project idProject;

}
