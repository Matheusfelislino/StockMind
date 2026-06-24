package com.stockmind.domain.sales;

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
    name = "tb_sales_history",
    indexes = {
        @Index(
            name = "idx_sales_history_store_product_date",
            columnList = "store_id, product_id, sale_date"
        )
    }
)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesHistory {

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

    @Column(name = "sale_date", nullable = false)
    private LocalDateTime saleDate;

    @Column(name = "quantity_sold", nullable = false)
    private Integer quantitySold;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

}