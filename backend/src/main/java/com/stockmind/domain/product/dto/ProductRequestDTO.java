package com.stockmind.domain.product.dto;

import com.stockmind.domain.product.CurveCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequestDTO {

    @NotBlank(message = "EAN é obrigatório")
    private String ean;

    @NotBlank(message = "Nome do produto é obrigatório")
    private String name;

    @NotNull(message = "Categoria da curva é obrigatória")
    private CurveCategory curveCategory;

    @NotNull(message = "Preço de custo é obrigatório")
    @Positive(message = "Preço de custo deve ser positivo")
    private BigDecimal costPrice;

    @NotNull(message = "Preço de venda é obrigatório")
    @Positive(message = "Preço de venda deve ser positivo")
    private BigDecimal salePrice;

}