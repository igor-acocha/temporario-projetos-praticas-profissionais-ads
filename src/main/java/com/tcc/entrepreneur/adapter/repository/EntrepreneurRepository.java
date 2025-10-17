package com.tcc.entrepreneur.adapter.repository;

import com.tcc.entrepreneur.entity.Entrepreneur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface EntrepreneurRepository extends JpaRepository<Entrepreneur, String>, JpaSpecificationExecutor<Entrepreneur> {
    Optional<Entrepreneur> findByUser_Id(Long id);
}
