package com.stockmind.api.dashboard;

import com.stockmind.domain.forecast.ForecastService;
import com.stockmind.domain.forecast.dto.ForecastResponseDTO;
import com.stockmind.domain.inventory.InventoryLotService;
import com.stockmind.domain.inventory.dto.InventoryLotResponseDTO;
import com.stockmind.domain.product.CurveCategory;
import com.stockmind.domain.product.ProductService;
import com.stockmind.domain.product.dto.ProductResponseDTO;
import com.stockmind.domain.recommendation.PurchaseRecommendationService;
import com.stockmind.domain.recommendation.RecommendationStatus;
import com.stockmind.domain.recommendation.dto.PurchaseRecommendationResponseDTO;
import com.stockmind.domain.sales.SalesHistoryService;
import com.stockmind.domain.sales.dto.SalesHistoryResponseDTO;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final InventoryLotService inventoryLotService;
    private final SalesHistoryService salesHistoryService;
    private final ForecastService forecastService;
    private final PurchaseRecommendationService recommendationService;
    private final ProductService productService;

    // ================================================
    // KPI 1: RISCO DE VENCIMENTO
    // Lotes críticos com vencimento em menos de 60 dias
    // ================================================
    @GetMapping("/kpi/expiration-risk")
    public ResponseEntity<ExpirationRiskKPI> getExpirationRisk(
            @RequestParam(defaultValue = "60") int daysAhead) {

        List<InventoryLotResponseDTO> criticalLots =
                inventoryLotService.findCriticalLots(daysAhead);

        BigDecimal totalAtRisk = criticalLots.stream()
                .map(lot -> lot.getExpirationDate() != null
                        ? BigDecimal.valueOf(lot.getQuantity())
                        : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(ExpirationRiskKPI.builder()
                .totalLotsAtRisk(criticalLots.size())
                .criticalLots(criticalLots)
                .build());
    }

    // ================================================
    // KPI 2: RUPTURA DA CURVA A
    // Produtos de alta demanda sem estoque suficiente
    // ================================================
    @GetMapping("/kpi/rupture")
    public ResponseEntity<RuptureKPI> getRupture(
            @RequestParam UUID storeId,
            @RequestParam(defaultValue = "30") int days) {

        LocalDateTime start = LocalDateTime.now().minusDays(days);
        LocalDateTime end = LocalDateTime.now();

        List<ProductResponseDTO> curveAProducts =
                productService.findByCurveCategory(CurveCategory.A);

        List<SalesHistoryResponseDTO> recentSales =
                salesHistoryService.findByStoreAndPeriod(storeId, start, end);

        List<ForecastResponseDTO> forecasts =
                forecastService.findByStore(storeId);

        return ResponseEntity.ok(RuptureKPI.builder()
                .storeId(storeId)
                .periodDays(days)
                .totalCurveAProducts(curveAProducts.size())
                .recentSales(recentSales)
                .forecasts(forecasts)
                .build());
    }

    // ================================================
    // KPI 3: RECOMENDAÇÕES PENDENTES
    // Ordens de compra aguardando aprovação humana
    // ================================================
    @GetMapping("/kpi/recommendations")
    public ResponseEntity<RecommendationsKPI> getRecommendations(
            @RequestParam(required = false) UUID storeId) {

        List<PurchaseRecommendationResponseDTO> pending = storeId != null
                ? recommendationService.findByStoreAndStatus(storeId, RecommendationStatus.PENDING)
                : recommendationService.findPending();

        BigDecimal totalFinancialImpact = pending.stream()
                .map(PurchaseRecommendationResponseDTO::getFinancialImpact)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(RecommendationsKPI.builder()
                .totalPending(pending.size())
                .totalFinancialImpact(totalFinancialImpact)
                .recommendations(pending)
                .build());
    }

    // ================================================
    // VISÃO GERAL — Todos os KPIs em uma chamada
    // ================================================
    @GetMapping("/overview")
    public ResponseEntity<DashboardOverview> getOverview(
            @RequestParam UUID storeId,
            @RequestParam(defaultValue = "30") int days,
            @RequestParam(defaultValue = "60") int expirationDaysAhead) {

        List<InventoryLotResponseDTO> criticalLots =
                inventoryLotService.findCriticalLots(expirationDaysAhead);

        List<ProductResponseDTO> curveAProducts =
                productService.findByCurveCategory(CurveCategory.A);

        List<PurchaseRecommendationResponseDTO> pending =
                recommendationService.findByStoreAndStatus(storeId, RecommendationStatus.PENDING);

        BigDecimal totalFinancialImpact = pending.stream()
                .map(PurchaseRecommendationResponseDTO::getFinancialImpact)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(DashboardOverview.builder()
                .storeId(storeId)
                .totalCurveAProducts(curveAProducts.size())
                .totalLotsAtRisk(criticalLots.size())
                .totalPendingRecommendations(pending.size())
                .totalFinancialImpact(totalFinancialImpact)
                .build());
    }

    // ================================================
    // INNER CLASSES — Response Payloads dos KPIs
    // ================================================

    @Data
    @Builder
    public static class ExpirationRiskKPI {
        private int totalLotsAtRisk;
        private List<InventoryLotResponseDTO> criticalLots;
    }

    @Data
    @Builder
    public static class RuptureKPI {
        private UUID storeId;
        private int periodDays;
        private int totalCurveAProducts;
        private List<SalesHistoryResponseDTO> recentSales;
        private List<ForecastResponseDTO> forecasts;
    }

    @Data
    @Builder
    public static class RecommendationsKPI {
        private int totalPending;
        private BigDecimal totalFinancialImpact;
        private List<PurchaseRecommendationResponseDTO> recommendations;
    }

    @Data
    @Builder
    public static class DashboardOverview {
        private UUID storeId;
        private int totalCurveAProducts;
        private int totalLotsAtRisk;
        private int totalPendingRecommendations;
        private BigDecimal totalFinancialImpact;
    }

}