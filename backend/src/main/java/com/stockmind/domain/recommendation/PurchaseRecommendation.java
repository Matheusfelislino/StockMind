package com.stockmind.domain.recommendation;

import com.stockmind.domain.product.Product;
import com.stockmind.domain.store.Store;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "tb_purchase_recommendations",
    indexes = {
        @Index(name = "idx_recommendations_store_id", columnList = "store_id"),
        @Index(name = "idx_recommendations_status", columnList = "status")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "suggested_quantity", nullable = false)
    private Integer suggestedQuantity;

    @Column(name = "financial_impact", nullable = false, precision = 10, scale = 2)
    private BigDecimal financialImpact;

    @Column(name = "rationale", nullable = false, columnDefinition = "TEXT")
    private String rationale;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RecommendationStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    private void prePersist() {
        this.status = RecommendationStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

}