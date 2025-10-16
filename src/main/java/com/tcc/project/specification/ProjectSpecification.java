package com.tcc.project.specification;

import com.tcc.common.specification.GenericSpecBuilder;
import com.tcc.project.entity.Project;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;


public final class ProjectSpecification {

    private ProjectSpecification() {}

    public static Specification<Project> build(
            Optional<String> idOptional,
            Optional<String> titleOptional,
            Optional<String> descriptionOptional,
            Optional<String> statusOptional,
            Optional<String> creationDateOptional,
            Optional<String> idEntrepreneurOptional
    ) {
        GenericSpecBuilder<Project> builder = new GenericSpecBuilder<>();

        idOptional.ifPresent(id -> builder.with("id", "=", id));
        titleOptional.ifPresent(title -> builder.with("title", "like", title));
        descriptionOptional.ifPresent(description -> builder.with("description", "like", description));
        statusOptional.ifPresent(status -> builder.with("status", "like", status));
        creationDateOptional.ifPresent(creationDate -> builder.with("creationDate", "like", creationDate));
        idEntrepreneurOptional.ifPresent(idEntrepreneur -> builder.with("idEntrepreneur.id", "=", idEntrepreneur));

        return builder.build();
    }
}
