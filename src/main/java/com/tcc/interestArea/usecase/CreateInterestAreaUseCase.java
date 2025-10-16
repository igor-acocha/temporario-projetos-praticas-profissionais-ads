package com.tcc.interestArea.usecase;

import com.tcc.interestArea.adapter.repository.InterestAreaRepository;
import com.tcc.interestArea.entity.InterestArea;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateInterestAreaUseCase {

    private final InterestAreaRepository repository;

    public void execute(InterestArea InterestArea) {
        repository.save(InterestArea);
    }
}
