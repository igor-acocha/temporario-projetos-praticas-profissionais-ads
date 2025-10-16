package com.tcc.skill.usecase;

import com.tcc.skill.adapter.repository.SkillRepository;
import com.tcc.skill.entity.Skill;
import com.tcc.skill.specification.SkillSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetByIdSkillUseCase {

    private final SkillRepository repository;

    public Skill execute(String id) {
        return repository.findOne(SkillSpecification.build(
                Optional.ofNullable(id),
                Optional.empty()
        )).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found.")
        );
    }
}
