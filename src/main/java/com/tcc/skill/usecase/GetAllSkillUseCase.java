package com.tcc.skill.usecase;

import com.tcc.skill.adapter.repository.SkillRepository;
import com.tcc.skill.entity.Skill;
import com.tcc.skill.specification.SkillSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class GetAllSkillUseCase {

    private final SkillRepository repository;

    public List<Skill> execute(String name) {
        return repository.findAll(
                SkillSpecification.build(
                        Optional.empty(),
                        Optional.ofNullable(name)
                )
        );
    }
}
