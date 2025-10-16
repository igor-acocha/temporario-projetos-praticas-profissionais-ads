package com.tcc.administrator.specification;

import com.tcc.common.specification.GenericSpecBuilder;
import com.tcc.administrator.entity.Administrator;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;


public final class AdministratorSpecification {

    private AdministratorSpecification() {}

    public static Specification<Administrator> build(
            Optional<String> idOptional,
            Optional<String> nameOptional,
            Optional<String> emailOptional,
            Optional<String> passwordOptional,
            Optional<String> creationDateOptional
    ) {
        GenericSpecBuilder<Administrator> builder = new GenericSpecBuilder<>();

        idOptional.ifPresent(id -> builder.with("id", "=", id));
        nameOptional.ifPresent(name -> builder.with("name", "like", name));
        emailOptional.ifPresent(email -> builder.with("email", "like", email));
        passwordOptional.ifPresent(password -> builder.with("password", "like", password));
        creationDateOptional.ifPresent(creationDate -> builder.with("creationDate", "like", creationDate));

        return builder.build();
    }
}
