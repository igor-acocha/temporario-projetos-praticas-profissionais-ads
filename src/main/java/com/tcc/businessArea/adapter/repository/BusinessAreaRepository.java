package com.tcc.businessArea.adapter.repository;

import com.tcc.businessArea.entity.BusinessArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface BusinessAreaRepository extends JpaRepository<BusinessArea, String>, JpaSpecificationExecutor<BusinessArea> {
}
