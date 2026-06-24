package com.stockmind.domain.inventory.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class InventoryLotRequestDTO {

    @NotNull(message = "ID da loja é obrigatório")
    private UUID storeId;

    @NotNull(message = "ID do produto é obrigatório")
    private UUID productId;

    @NotBlank(message = "Número do lote é obrigatório")
    private String batchNumber;

    @NotNull(message = "Data de vencimento é obrigatória")
    private LocalDate expirationDate;

    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 0, message = "Quantidade não pode ser negativa")
    private Integer quantity;

}