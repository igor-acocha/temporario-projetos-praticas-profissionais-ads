package com.tcc.businessArea.usecase;

import com.tcc.businessArea.adapter.repository.BusinessAreaRepository;
import com.tcc.businessArea.entity.BusinessArea;
import com.tcc.businessArea.specification.BusinessAreaSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GetByIdBusinessAreaUseCase {

    private final BusinessAreaRepository repository;

    public BusinessArea execute(String id) {
        return repository.findOne(BusinessAreaSpecification.build(
                Optional.ofNullable(id),
                Optional.empty()
        )).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "BusinessArea not found.")
        );
    }
}
