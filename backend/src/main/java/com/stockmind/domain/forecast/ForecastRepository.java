package com.stockmind.domain.forecast;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ForecastRepository extends JpaRepository<Forecast, UUID> {

    List<Forecast> findAllByStoreIdAndProductId(UUID storeId, UUID productId);

    List<Forecast> findAllByTargetDateAfter(LocalDate date);

    List<Forecast> findAllByStoreIdAndTargetDateAfter(UUID storeId, LocalDate date);

}