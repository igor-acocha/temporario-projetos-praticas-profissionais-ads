package com.tcc.application.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import com.tcc.student.entity.Student;
import com.tcc.project.entity.Project;
import lombok.*;

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
    private String applicationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_student")
    private Student idStudent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_project")
    private Project idProject;

}
