package com.stockmind.domain.inventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface InventoryLotRepository extends JpaRepository<InventoryLot, UUID> {

    List<InventoryLot> findAllByStoreId(UUID storeId);

    List<InventoryLot> findAllByProductId(UUID productId);

    List<InventoryLot> findAllByStoreIdAndProductId(UUID storeId, UUID productId);

    // KPI: Risco de Vencimento — lotes críticos com vencimento próximo
    @Query("""
        SELECT il FROM InventoryLot il
        WHERE il.expirationDate <= :limitDate
        AND il.quantity > 0
        ORDER BY il.expirationDate ASC
    """)
    List<InventoryLot> findCriticalLots(@Param("limitDate") LocalDate limitDate);

}