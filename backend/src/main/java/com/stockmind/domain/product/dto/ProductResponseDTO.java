package com.stockmind.domain.product.dto;

import com.stockmind.domain.product.CurveCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ProductResponseDTO {

    private UUID id;
    private String ean;
    private String name;
    private CurveCategory curveCategory;
    private BigDecimal costPrice;
    private BigDecimal salePrice;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}