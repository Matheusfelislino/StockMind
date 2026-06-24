package com.stockmind.domain.sales;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SalesHistoryRepository extends JpaRepository<SalesHistory, UUID> {

    List<SalesHistory> findAllByStoreIdAndProductId(UUID storeId, UUID productId);

    // KPI: Ruptura — total vendido por produto em um período
    @Query("""
        SELECT sh FROM SalesHistory sh
        WHERE sh.store.id = :storeId
        AND sh.saleDate BETWEEN :start AND :end
        ORDER BY sh.saleDate DESC
    """)
    List<SalesHistory> findByStoreAndPeriod(
        @Param("storeId") UUID storeId,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );

}