package com.stockmind.domain.recommendation;

import com.stockmind.domain.product.Product;
import com.stockmind.domain.product.ProductRepository;
import com.stockmind.domain.recommendation.dto.PurchaseRecommendationRequestDTO;
import com.stockmind.domain.recommendation.dto.PurchaseRecommendationResponseDTO;
import com.stockmind.domain.store.Store;
import com.stockmind.domain.store.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PurchaseRecommendationService {

    private final PurchaseRecommendationRepository recommendationRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<PurchaseRecommendationResponseDTO> findPending() {
        return recommendationRepository.findAllByStatus(RecommendationStatus.PENDING)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PurchaseRecommendationResponseDTO> findByStoreAndStatus(
            UUID storeId,
            RecommendationStatus status) {
        return recommendationRepository.findAllByStoreIdAndStatus(storeId, status)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public PurchaseRecommendationResponseDTO updateStatus(PurchaseRecommendationRequestDTO dto) {
        PurchaseRecommendation recommendation = recommendationRepository.findById(dto.getId())
                .orElseThrow(() -> new EntityNotFoundException("Recomendação não encontrada: " + dto.getId()));

        if (recommendation.getStatus() != RecommendationStatus.PENDING) {
            throw new IllegalStateException("Apenas recomendações PENDING podem ser atualizadas.");
        }

        recommendation.setStatus(dto.getStatus());
        return toResponseDTO(recommendationRepository.save(recommendation));
    }

    @Transactional
    public void saveBatch(List<Map<String, Object>> payload) {
        List<PurchaseRecommendation> recommendations = payload.stream().map(item -> {
            UUID storeId = UUID.fromString((String) item.get("store_id"));
            UUID productId = UUID.fromString((String) item.get("product_id"));

            Store store = storeRepository.findByIdAndActiveTrue(storeId)
                    .orElseThrow(() -> new EntityNotFoundException("Loja não encontrada: " + storeId));

            Product product = productRepository.findByIdAndActiveTrue(productId)
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + productId));

            return PurchaseRecommendation.builder()
                    .store(store)
                    .product(product)
                    .suggestedQuantity((Integer) item.get("suggested_quantity"))
                    .financialImpact(new BigDecimal(item.get("financial_impact").toString()))
                    .rationale((String) item.get("rationale"))
                    .build();
        }).toList();

        recommendationRepository.saveAll(recommendations);
    }

    private PurchaseRecommendationResponseDTO toResponseDTO(PurchaseRecommendation rec) {
        return PurchaseRecommendationResponseDTO.builder()
                .id(rec.getId())
                .storeId(rec.getStore().getId())
                .storeName(rec.getStore().getName())
                .productId(rec.getProduct().getId())
                .productName(rec.getProduct().getName())
                .suggestedQuantity(rec.getSuggestedQuantity())
                .financialImpact(rec.getFinancialImpact())
                .rationale(rec.getRationale())
                .status(rec.getStatus())
                .createdAt(rec.getCreatedAt())
                .build();
    }

}