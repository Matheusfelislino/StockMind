package com.stockmind.domain.sales.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class SalesHistoryRequestDTO {

    @NotNull(message = "ID da loja é obrigatório")
    private UUID storeId;

    @NotNull(message = "ID do produto é obrigatório")
    private UUID productId;

    @NotNull(message = "Data da venda é obrigatória")
    private LocalDateTime saleDate;

    @NotNull(message = "Quantidade vendida é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    private Integer quantitySold;

    @NotNull(message = "Preço unitário é obrigatório")
    @Positive(message = "Preço unitário deve ser positivo")
    private BigDecimal unitPrice;

}