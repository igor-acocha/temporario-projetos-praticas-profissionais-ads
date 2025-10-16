package com.tcc.entrepreneur.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.List;
import com.tcc.project.entity.Project;
import java.util.ArrayList;
import com.tcc.businessArea.entity.BusinessArea;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "entrepreneur")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Entrepreneur {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false, length = 36)
    private String id;

    @Column(name = "cnpj", length = 20)
    private String cnpj;

    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "phone", nullable = false, length = 50)
    private String phone;

    @Column(name = "registration_date")
    private String registrationDate;

    @OneToMany(mappedBy = "idEntrepreneur", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Project> projects;

    // Relacionamento Many-to-Many simples - LADO INVERSO
    @ManyToMany(mappedBy = "entrepreneurs")
    @JsonBackReference
    private List<BusinessArea> businessAreas = new ArrayList<>();

}
