package com.tcc.skill.usecase;

import com.tcc.skill.adapter.repository.SkillRepository;
import com.tcc.skill.entity.Skill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UpdateSkillUseCase {

    private final SkillRepository repository;

    public Skill execute(String id, Skill updatedSkill) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found with id: " + id);
        }
        
        updatedSkill.setId(id);
        return repository.save(updatedSkill);
    }
}
