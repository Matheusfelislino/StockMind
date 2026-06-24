package com.stockmind.domain.recommendation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PurchaseRecommendationRepository extends JpaRepository<PurchaseRecommendation, UUID> {

    List<PurchaseRecommendation> findAllByStoreIdAndStatus(UUID storeId, RecommendationStatus status);

    List<PurchaseRecommendation> findAllByStatus(RecommendationStatus status);

}