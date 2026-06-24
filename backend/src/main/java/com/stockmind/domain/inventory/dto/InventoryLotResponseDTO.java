package com.stockmind.domain.inventory.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class InventoryLotResponseDTO {

    private UUID id;
    private UUID storeId;
    private String storeName;
    private UUID productId;
    private String productName;
    private String batchNumber;
    private LocalDate expirationDate;
    private Integer quantity;
    private LocalDateTime updatedAt;

}