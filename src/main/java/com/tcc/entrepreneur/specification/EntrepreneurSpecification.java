package com.tcc.entrepreneur.specification;

import com.tcc.common.specification.GenericSpecBuilder;
import com.tcc.entrepreneur.entity.Entrepreneur;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;


public final class EntrepreneurSpecification {

    private EntrepreneurSpecification() {}

    public static Specification<Entrepreneur> build(
            Optional<String> idOptional,
            Optional<String> cnpjOptional,
            Optional<String> companyNameOptional,
            Optional<String> descriptionOptional,
            Optional<String> emailOptional,
            Optional<String> phoneOptional,
            Optional<String> registrationDateOptional
    ) {
        GenericSpecBuilder<Entrepreneur> builder = new GenericSpecBuilder<>();

        idOptional.ifPresent(id -> builder.with("id", "=", id));
        cnpjOptional.ifPresent(cnpj -> builder.with("cnpj", "like", cnpj));
        companyNameOptional.ifPresent(companyName -> builder.with("companyName", "like", companyName));
        descriptionOptional.ifPresent(description -> builder.with("description", "like", description));
        emailOptional.ifPresent(email -> builder.with("email", "like", email));
        phoneOptional.ifPresent(phone -> builder.with("phone", "like", phone));
        registrationDateOptional.ifPresent(registrationDate -> builder.with("registrationDate", "like", registrationDate));

        return builder.build();
    }
}
