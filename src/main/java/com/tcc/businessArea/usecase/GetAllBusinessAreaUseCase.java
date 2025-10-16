package com.tcc.businessArea.usecase;

import com.tcc.businessArea.adapter.repository.BusinessAreaRepository;
import com.tcc.businessArea.entity.BusinessArea;
import com.tcc.businessArea.specification.BusinessAreaSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class GetAllBusinessAreaUseCase {

    private final BusinessAreaRepository repository;

    public List<BusinessArea> execute(String name) {
        return repository.findAll(
                BusinessAreaSpecification.build(
                        Optional.empty(),
                        Optional.ofNullable(name)
                )
        );
    }
}
