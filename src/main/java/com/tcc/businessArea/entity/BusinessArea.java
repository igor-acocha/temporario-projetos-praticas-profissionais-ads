package com.tcc.businessArea.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;
import java.util.List;
import java.util.ArrayList;
import com.tcc.entrepreneur.entity.Entrepreneur;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "business_area")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BusinessArea  {

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
        name = "entrepreneur_business_area",
        joinColumns = @JoinColumn(name = "id_business_area"),
        inverseJoinColumns = @JoinColumn(name = "id_entrepreneur")
    )
    @JsonManagedReference
    private List<Entrepreneur> entrepreneurs = new ArrayList<>();

}
