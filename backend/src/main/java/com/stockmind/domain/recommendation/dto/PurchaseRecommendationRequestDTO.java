package com.stockmind.domain.recommendation.dto;

import com.stockmind.domain.recommendation.RecommendationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class PurchaseRecommendationRequestDTO {

    @NotNull(message = "ID da recomendação é obrigatório")
    private UUID id;

    @NotNull(message = "Status é obrigatório")
    private RecommendationStatus status;

}