package com.tcc.businessArea.specification;

import com.tcc.common.specification.GenericSpecBuilder;
import com.tcc.businessArea.entity.BusinessArea;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;


public final class BusinessAreaSpecification {

    private BusinessAreaSpecification() {}

    public static Specification<BusinessArea> build(
            Optional<String> idOptional,
            Optional<String> nameOptional
    ) {
        GenericSpecBuilder<BusinessArea> builder = new GenericSpecBuilder<>();

        idOptional.ifPresent(id -> builder.with("id", "=", id));
        nameOptional.ifPresent(name -> builder.with("name", "like", name));

        return builder.build();
    }
}
