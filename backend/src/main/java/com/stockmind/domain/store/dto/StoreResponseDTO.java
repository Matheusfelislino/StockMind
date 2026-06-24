package com.stockmind.domain.store.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class StoreResponseDTO {

    private UUID id;
    private String name;
    private String managerName;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}