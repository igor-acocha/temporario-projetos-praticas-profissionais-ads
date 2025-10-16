package com.tcc.project.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import com.tcc.entrepreneur.entity.Entrepreneur;
import java.util.List;
import com.tcc.application.entity.Application;
import com.tcc.evaluation.entity.Evaluation;
import lombok.*;

@Entity
@Table(name = "project")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Project {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, length = 36)
    private String id;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "creation_date")
    private String creationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_entrepreneur")
    private Entrepreneur idEntrepreneur;

    @OneToMany(mappedBy = "idProject", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Application> applications;

    @OneToMany(mappedBy = "idProject", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Evaluation> evaluations;

}
