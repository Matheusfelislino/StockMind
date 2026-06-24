package com.stockmind.domain.inventory;

import com.stockmind.domain.product.Product;
import com.stockmind.domain.store.Store;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "tb_inventory_lots",
    indexes = {
        @Index(name = "idx_inventory_lots_store_id", columnList = "store_id"),
        @Index(name = "idx_inventory_lots_product_id", columnList = "product_id"),
        @Index(name = "idx_inventory_lots_expiration", columnList = "expiration_date")
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryLot {

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

    @Column(name = "batch_number", nullable = false)
    private String batchNumber;

    @Column(name = "expiration_date", nullable = false)
    private LocalDate expirationDate;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    private void prePersist() {
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    private void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}