package com.tcc.entrepreneur.usecase;

import com.tcc.entrepreneur.adapter.repository.EntrepreneurRepository;
import com.tcc.entrepreneur.entity.Entrepreneur;
import com.tcc.entrepreneur.specification.EntrepreneurSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class GetAllEntrepreneurUseCase {

    private final EntrepreneurRepository repository;

    public List<Entrepreneur> execute(String cnpj, String companyName, String description, String email, String phone, String registrationDate) {
        return repository.findAll(
                EntrepreneurSpecification.build(
                        Optional.empty(),
                        Optional.ofNullable(cnpj),
                        Optional.ofNullable(companyName),
                        Optional.ofNullable(description),
                        Optional.ofNullable(email),
                        Optional.ofNullable(phone),
                        Optional.ofNullable(registrationDate)
                )
        );
    }
}
