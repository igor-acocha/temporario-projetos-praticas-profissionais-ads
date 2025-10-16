package com.tcc.student.specification;

import com.tcc.common.specification.GenericSpecBuilder;
import com.tcc.student.entity.Student;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;


public final class StudentSpecification {

    private StudentSpecification() {}

    public static Specification<Student> build(
            Optional<String> idOptional,
            Optional<String> nameOptional,
            Optional<String> phoneOptional,
            Optional<String> emailOptional,
            Optional<String> descriptionOptional,
            Optional<String> registrationDateOptional
    ) {
        GenericSpecBuilder<Student> builder = new GenericSpecBuilder<>();

        idOptional.ifPresent(id -> builder.with("id", "=", id));
        nameOptional.ifPresent(name -> builder.with("name", "like", name));
        phoneOptional.ifPresent(phone -> builder.with("phone", "like", phone));
        emailOptional.ifPresent(email -> builder.with("email", "like", email));
        descriptionOptional.ifPresent(description -> builder.with("description", "like", description));
        registrationDateOptional.ifPresent(registrationDate -> builder.with("registrationDate", "like", registrationDate));

        return builder.build();
    }
}
