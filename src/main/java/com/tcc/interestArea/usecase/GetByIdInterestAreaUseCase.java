package com.tcc.interestArea.usecase;

import com.tcc.interestArea.adapter.repository.InterestAreaRepository;
import com.tcc.interestArea.entity.InterestArea;
import com.tcc.interestArea.specification.InterestAreaSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetByIdInterestAreaUseCase {

    private final InterestAreaRepository repository;

    public InterestArea execute(String id) {
        return repository.findOne(InterestAreaSpecification.build(
                Optional.ofNullable(id),
                Optional.empty()
        )).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "InterestArea not found.")
        );
    }
}
