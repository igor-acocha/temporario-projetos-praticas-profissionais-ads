package com.tcc.application.usecase;

import com.tcc.application.adapter.repository.ApplicationRepository;
import com.tcc.application.entity.Application;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateApplicationUseCase {

    private final ApplicationRepository repository;

    public void execute(Application Application) {
        repository.save(Application);
    }
}
