package com.tcc.skill.specification;

import com.tcc.common.specification.GenericSpecBuilder;
import com.tcc.skill.entity.Skill;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;


public final class SkillSpecification {

    private SkillSpecification() {}

    public static Specification<Skill> build(
            Optional<String> idOptional,
            Optional<String> nameOptional
    ) {
        GenericSpecBuilder<Skill> builder = new GenericSpecBuilder<>();

        idOptional.ifPresent(id -> builder.with("id", "=", id));
        nameOptional.ifPresent(name -> builder.with("name", "like", name));

        return builder.build();
    }
}
