package com.stockmind.domain.recommendation.dto;

import com.stockmind.domain.recommendation.RecommendationStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class PurchaseRecommendationResponseDTO {

    private UUID id;
    private UUID storeId;
    private String storeName;
    private UUID productId;
    private String productName;
    private Integer suggestedQuantity;
    private BigDecimal financialImpact;
    private String rationale;
    private RecommendationStatus status;
    private LocalDateTime createdAt;

}