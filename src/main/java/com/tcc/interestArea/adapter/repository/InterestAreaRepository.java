package com.tcc.interestArea.adapter.repository;

import com.tcc.interestArea.entity.InterestArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface InterestAreaRepository extends JpaRepository<InterestArea, String>, JpaSpecificationExecutor<InterestArea> {
}
