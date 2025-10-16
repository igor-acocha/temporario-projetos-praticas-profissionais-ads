package com.tcc.skill.usecase;

import com.tcc.skill.adapter.repository.SkillRepository;
import com.tcc.skill.entity.Skill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateSkillUseCase {

    private final SkillRepository repository;

    public void execute(Skill Skill) {
        repository.save(Skill);
    }
}
