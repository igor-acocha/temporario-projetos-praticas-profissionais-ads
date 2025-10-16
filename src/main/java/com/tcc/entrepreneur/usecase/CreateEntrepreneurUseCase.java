package com.tcc.entrepreneur.usecase;

import com.tcc.entrepreneur.adapter.repository.EntrepreneurRepository;
import com.tcc.entrepreneur.entity.Entrepreneur;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateEntrepreneurUseCase {

    private final EntrepreneurRepository repository;

    public void execute(Entrepreneur Entrepreneur) {
        repository.save(Entrepreneur);
    }
}
