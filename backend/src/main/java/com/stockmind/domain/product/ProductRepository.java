package com.stockmind.domain.product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findAllByActiveTrue();

    Optional<Product> findByIdAndActiveTrue(UUID id);

    Optional<Product> findByEanAndActiveTrue(String ean);

    List<Product> findAllByCurveCategoryAndActiveTrue(CurveCategory curveCategory);

}