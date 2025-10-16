package com.tcc.interestArea.usecase;

import com.tcc.interestArea.adapter.repository.InterestAreaRepository;
import com.tcc.interestArea.entity.InterestArea;
import com.tcc.interestArea.specification.InterestAreaSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class GetAllInterestAreaUseCase {

    private final InterestAreaRepository repository;

    public List<InterestArea> execute(String name) {
        return repository.findAll(
                InterestAreaSpecification.build(
                        Optional.empty(),
                        Optional.ofNullable(name)
                )
        );
    }
}
