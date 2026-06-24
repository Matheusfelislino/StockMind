package com.stockmind.domain.sales.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class SalesHistoryResponseDTO {

    private UUID id;
    private UUID storeId;
    private String storeName;
    private UUID productId;
    private String productName;
    private LocalDateTime saleDate;
    private Integer quantitySold;
    private BigDecimal unitPrice;
    private BigDecimal totalValue;

}