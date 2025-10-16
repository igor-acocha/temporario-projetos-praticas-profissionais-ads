package com.tcc.administrator.adapter.repository;

import com.tcc.administrator.entity.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AdministratorRepository extends JpaRepository<Administrator, String>, JpaSpecificationExecutor<Administrator> {
}
