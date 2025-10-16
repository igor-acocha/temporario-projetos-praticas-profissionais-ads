package com.tcc.entrepreneur.adapter.repository;

import com.tcc.entrepreneur.entity.Entrepreneur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface EntrepreneurRepository extends JpaRepository<Entrepreneur, String>, JpaSpecificationExecutor<Entrepreneur> {
}
