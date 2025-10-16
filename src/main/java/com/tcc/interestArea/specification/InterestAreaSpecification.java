package com.tcc.interestArea.specification;

import com.tcc.common.specification.GenericSpecBuilder;
import com.tcc.interestArea.entity.InterestArea;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;


public final class InterestAreaSpecification {

    private InterestAreaSpecification() {}

    public static Specification<InterestArea> build(
            Optional<String> idOptional,
            Optional<String> nameOptional
    ) {
        GenericSpecBuilder<InterestArea> builder = new GenericSpecBuilder<>();

        idOptional.ifPresent(id -> builder.with("id", "=", id));
        nameOptional.ifPresent(name -> builder.with("name", "like", name));

        return builder.build();
    }
}
