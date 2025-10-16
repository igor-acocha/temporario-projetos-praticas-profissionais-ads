package com.tcc.application.specification;

import com.tcc.common.specification.GenericSpecBuilder;
import com.tcc.application.entity.Application;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;


public final class ApplicationSpecification {

    private ApplicationSpecification() {}

    public static Specification<Application> build(
            Optional<String> idOptional,
            Optional<String> ideaOptional,
            Optional<String> statusOptional,
            Optional<String> applicationDateOptional,
            Optional<String> idStudentOptional,
            Optional<String> idProjectOptional
    ) {
        GenericSpecBuilder<Application> builder = new GenericSpecBuilder<>();

        idOptional.ifPresent(id -> builder.with("id", "=", id));
        ideaOptional.ifPresent(idea -> builder.with("idea", "like", idea));
        statusOptional.ifPresent(status -> builder.with("status", "like", status));
        applicationDateOptional.ifPresent(applicationDate -> builder.with("applicationDate", "like", applicationDate));
        idStudentOptional.ifPresent(idStudent -> builder.with("idStudent.id", "=", idStudent));
        idProjectOptional.ifPresent(idProject -> builder.with("idProject.id", "=", idProject));

        return builder.build();
    }
}
