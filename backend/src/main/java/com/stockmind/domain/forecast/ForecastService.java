package com.stockmind.domain.forecast;

import com.stockmind.domain.forecast.dto.ForecastResponseDTO;
import com.stockmind.domain.product.Product;
import com.stockmind.domain.product.ProductRepository;
import com.stockmind.domain.store.Store;
import com.stockmind.domain.store.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ForecastService {

    private final ForecastRepository forecastRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ForecastResponseDTO> findByStore(UUID storeId) {
        return forecastRepository.findAllByStoreIdAndTargetDateAfter(storeId, LocalDate.now())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ForecastResponseDTO> findByStoreAndProduct(UUID storeId, UUID productId) {
        return forecastRepository.findAllByStoreIdAndProductId(storeId, productId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ForecastResponseDTO> findUpcoming() {
        return forecastRepository.findAllByTargetDateAfter(LocalDate.now())
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public void saveBatch(List<Map<String, Object>> forecastPayload) {
        List<Forecast> forecasts = forecastPayload.stream().map(payload -> {
            UUID storeId = UUID.fromString((String) payload.get("store_id"));
            UUID productId = UUID.fromString((String) payload.get("product_id"));

            Store store = storeRepository.findByIdAndActiveTrue(storeId)
                    .orElseThrow(() -> new EntityNotFoundException("Loja não encontrada: " + storeId));

            Product product = productRepository.findByIdAndActiveTrue(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + productId));

            return Forecast.builder()
                    .store(store)
                    .product(product)
                    .targetDate(LocalDate.parse((String) payload.get("target_date")))
                    .predictedQuantity((Integer) payload.get("predicted_quantity"))
                    .confidenceScore(new BigDecimal(payload.get("confidence_score").toString()))
                    .build();
        }).toList();

        forecastRepository.saveAll(forecasts);
    }

    private ForecastResponseDTO toResponseDTO(Forecast forecast) {
        return ForecastResponseDTO.builder()
                .id(forecast.getId())
                .storeId(forecast.getStore().getId())
                .storeName(forecast.getStore().getName())
                .productId(forecast.getProduct().getId())
                .productName(forecast.getProduct().getName())
                .targetDate(forecast.getTargetDate())
                .predictedQuantity(forecast.getPredictedQuantity())
                .confidenceScore(forecast.getConfidenceScore())
                .createdAt(forecast.getCreatedAt())
                .build();
    }

}