package com.tcc.businessArea.usecase;

import com.tcc.businessArea.adapter.repository.BusinessAreaRepository;
import com.tcc.businessArea.entity.BusinessArea;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateBusinessAreaUseCase {

    private final BusinessAreaRepository repository;

    public void execute(BusinessArea BusinessArea) {
        repository.save(BusinessArea);
    }
}
