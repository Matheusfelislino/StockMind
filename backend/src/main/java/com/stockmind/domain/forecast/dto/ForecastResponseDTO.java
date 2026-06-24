package com.stockmind.domain.forecast.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ForecastResponseDTO {

    private UUID id;
    private UUID storeId;
    private String storeName;
    private UUID productId;
    private String productName;
    private LocalDate targetDate;
    private Integer predictedQuantity;
    private BigDecimal confidenceScore;
    private LocalDateTime createdAt;

}