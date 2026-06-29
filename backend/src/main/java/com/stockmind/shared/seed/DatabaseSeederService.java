package com.stockmind.shared.seed;

import com.stockmind.domain.inventory.InventoryLot;
import com.stockmind.domain.inventory.InventoryLotRepository;
import com.stockmind.domain.product.CurveCategory;
import com.stockmind.domain.product.Product;
import com.stockmind.domain.product.ProductRepository;
import com.stockmind.domain.sales.SalesHistory;
import com.stockmind.domain.sales.SalesHistoryRepository;
import com.stockmind.domain.store.Store;
import com.stockmind.domain.store.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class DatabaseSeederService {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeederService.class);

    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final InventoryLotRepository inventoryLotRepository;
    private final SalesHistoryRepository salesHistoryRepository;

    // Catálogo com dados de base para geração de estoque e vendas
    private record ProductData(
            String ean,
            String name,
            CurveCategory curve,
            BigDecimal costPrice,
            BigDecimal salePrice,
            int dailyAvg,
            int variance
    ) {}

    private static final List<ProductData> CATALOG = List.of(
            new ProductData("7891058001001", "Dipirona Sódica 500mg",          CurveCategory.A, new BigDecimal("0.80"),  new BigDecimal("2.90"),  55, 10),
            new ProductData("7891058001002", "Losartana Potássica 50mg",        CurveCategory.A, new BigDecimal("0.45"),  new BigDecimal("1.90"),  32,  8),
            new ProductData("7891058001003", "Omeprazol 20mg",                  CurveCategory.A, new BigDecimal("0.60"),  new BigDecimal("2.50"),  28,  7),
            new ProductData("7891058001004", "Amoxicilina + Clavulanato 875mg", CurveCategory.A, new BigDecimal("3.20"),  new BigDecimal("14.90"), 12,  4),
            new ProductData("7891058001005", "Atorvastatina Cálcica 20mg",      CurveCategory.B, new BigDecimal("0.95"),  new BigDecimal("4.20"),  10,  3),
            new ProductData("7891058001006", "Metformina 850mg",                CurveCategory.B, new BigDecimal("0.38"),  new BigDecimal("1.70"),  15,  5),
            new ProductData("7891058001007", "Azitromicina 500mg",              CurveCategory.B, new BigDecimal("2.80"),  new BigDecimal("13.50"),  5,  2),
            new ProductData("7891058001008", "Insulina Glargina 100UI/mL",      CurveCategory.C, new BigDecimal("68.00"), new BigDecimal("189.00"),  2,  1),
            new ProductData("7891058001009", "Clonazepam 2mg",                  CurveCategory.C, new BigDecimal("0.90"),  new BigDecimal("3.80"),   4,  2),
            new ProductData("7891058001010", "Vitamina D3 2000UI",              CurveCategory.C, new BigDecimal("12.50"), new BigDecimal("42.00"),   4,  2)
    );

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        if (storeRepository.count() > 0) {
            log.info("[SEEDER] Banco já contém dados — seed ignorado.");
            return;
        }

        log.info("[SEEDER] ========================================");
        log.info("[SEEDER] Banco vazio detectado. Iniciando seed...");
        log.info("[SEEDER] ========================================");

        List<Store> stores = seedStores();
        List<Product> products = seedProducts();
        seedInventoryLots(stores, products);
        seedSalesHistory(stores, products);

        log.info("[SEEDER] ================================================");
        log.info("[SEEDER] Seed concluído: {} lojas | {} produtos | 90 dias de histórico de vendas",
                stores.size(), products.size());
        log.info("[SEEDER] ================================================");
    }

    // ================================================
    // LOJAS
    // ================================================

    private List<Store> seedStores() {
        List<Store> stores = storeRepository.saveAll(List.of(
                Store.builder().name("Farmácia Centro").managerName("Carlos Andrade").build(),
                Store.builder().name("Farmácia Zona Norte").managerName("Fernanda Lima").build(),
                Store.builder().name("Farmácia Zona Sul").managerName("Roberto Souza").build()
        ));
        log.info("[SEEDER] {} lojas criadas.", stores.size());
        return stores;
    }

    // ================================================
    // PRODUTOS
    // ================================================

    private List<Product> seedProducts() {
        List<Product> products = productRepository.saveAll(
                CATALOG.stream()
                        .map(d -> Product.builder()
                                .ean(d.ean())
                                .name(d.name())
                                .curveCategory(d.curve())
                                .costPrice(d.costPrice())
                                .salePrice(d.salePrice())
                                .build())
                        .toList()
        );
        log.info("[SEEDER] {} produtos criados (4 Curva-A | 3 Curva-B | 3 Curva-C).", products.size());
        return products;
    }

    // ================================================
    // ESTOQUE — 3 CENÁRIOS ESTRATÉGICOS INTENCIONAIS
    // ================================================

    private void seedInventoryLots(List<Store> stores, List<Product> products) {
        LocalDate today = LocalDate.now();
        LocalDate exp2027 = LocalDate.of(2027, 12, 31);

        // Aliases de lojas e produtos para legibilidade
        Store centro = stores.get(0);
        Store norte  = stores.get(1);
        Store sul    = stores.get(2);

        Product dipirona    = products.get(0);
        Product losartana   = products.get(1);
        Product omeprazol   = products.get(2);
        Product amoxicilina = products.get(3);
        Product atorva      = products.get(4);
        Product metformina  = products.get(5);
        Product azitro      = products.get(6);
        Product insulina    = products.get(7);
        Product clonazepam  = products.get(8);
        Product vitaminaD3  = products.get(9);

        List<InventoryLot> lots = new ArrayList<>();

        // ── CENÁRIO 1: RUPTURA ──────────────────────────────────────────
        // Dipirona Centro: apenas 8 unidades (demanda média ~55/dia → ruptura imediata)
        lots.add(lot(centro, dipirona,  "LOTE-DIP-C001", today.plusDays(180),    8));
        lots.add(lot(norte,  dipirona,  "LOTE-DIP-N001", exp2027,             4_500));
        lots.add(lot(sul,    dipirona,  "LOTE-DIP-S001", exp2027,             4_200));

        // Losartana Norte: apenas 5 unidades (demanda média ~32/dia → ruptura imediata)
        lots.add(lot(centro, losartana, "LOTE-LOS-C001", exp2027,             2_900));
        lots.add(lot(norte,  losartana, "LOTE-LOS-N001", today.plusDays(180),    5));
        lots.add(lot(sul,    losartana, "LOTE-LOS-S001", exp2027,             2_500));

        log.warn("[SEEDER] CENÁRIO 1 — RUPTURA: Dipirona/Centro=8un (demanda ~55/dia) | Losartana/Norte=5un (demanda ~32/dia)");

        // ── Omeprazol: estoque saudável em todas as lojas ───────────────
        lots.add(lot(centro, omeprazol, "LOTE-OME-C001", exp2027, 2_400));
        lots.add(lot(norte,  omeprazol, "LOTE-OME-N001", exp2027, 2_200));
        lots.add(lot(sul,    omeprazol, "LOTE-OME-S001", exp2027, 2_000));

        // ── CENÁRIO 2: RISCO DE VENCIMENTO ──────────────────────────────
        // Amoxicilina Centro: 180un vencendo em 30 dias
        lots.add(lot(centro, amoxicilina, "LOTE-AMO-C001", today.plusDays(30),  180));
        lots.add(lot(norte,  amoxicilina, "LOTE-AMO-N001", exp2027,           1_000));
        lots.add(lot(sul,    amoxicilina, "LOTE-AMO-S001", exp2027,             900));

        // Azitromicina Norte: 60un vencendo em 20 dias
        lots.add(lot(centro, azitro, "LOTE-AZI-C001", exp2027,             450));
        lots.add(lot(norte,  azitro, "LOTE-AZI-N001", today.plusDays(20),   60));
        lots.add(lot(sul,    azitro, "LOTE-AZI-S001", exp2027,             400));

        log.warn("[SEEDER] CENÁRIO 2 — VENCIMENTO: Amoxicilina/Centro vence em {} | Azitromicina/Norte vence em {}",
                today.plusDays(30), today.plusDays(20));

        // ── Atorvastatina: estoque normal ───────────────────────────────
        lots.add(lot(centro, atorva, "LOTE-ATO-C001", exp2027, 900));
        lots.add(lot(norte,  atorva, "LOTE-ATO-N001", exp2027, 850));
        lots.add(lot(sul,    atorva, "LOTE-ATO-S001", exp2027, 800));

        // ── Metformina: estoque normal ───────────────────────────────────
        lots.add(lot(centro, metformina, "LOTE-MET-C001", exp2027, 1_350));
        lots.add(lot(norte,  metformina, "LOTE-MET-N001", exp2027, 1_200));
        lots.add(lot(sul,    metformina, "LOTE-MET-S001", exp2027, 1_100));

        // ── Insulina: lotes pequenos (produto de alto custo) ─────────────
        lots.add(lot(centro, insulina, "LOTE-INS-C001", today.plusDays(180), 60));
        lots.add(lot(norte,  insulina, "LOTE-INS-N001", today.plusDays(180), 55));
        lots.add(lot(sul,    insulina, "LOTE-INS-S001", today.plusDays(180), 50));

        // ── Clonazepam: estoque moderado (medicamento controlado) ────────
        lots.add(lot(centro, clonazepam, "LOTE-CLO-C001", exp2027, 360));
        lots.add(lot(norte,  clonazepam, "LOTE-CLO-N001", exp2027, 320));
        lots.add(lot(sul,    clonazepam, "LOTE-CLO-S001", exp2027, 300));

        // ── CENÁRIO 3: CAPITAL TRAVADO ───────────────────────────────────
        // Vitamina D3 Centro: 720un (média 4/dia → ~180 dias de cobertura)
        lots.add(lot(centro, vitaminaD3, "LOTE-VIT-C001", LocalDate.of(2028, 6, 30), 720));
        lots.add(lot(norte,  vitaminaD3, "LOTE-VIT-N001", LocalDate.of(2028, 6, 30), 180));
        lots.add(lot(sul,    vitaminaD3, "LOTE-VIT-S001", LocalDate.of(2028, 6, 30), 150));

        log.warn("[SEEDER] CENÁRIO 3 — CAPITAL TRAVADO: VitaminaD3/Centro=720un (~180 dias de cobertura, Curva-C)");

        inventoryLotRepository.saveAll(lots);
        log.info("[SEEDER] {} lotes de estoque criados.", lots.size());
    }

    // ================================================
    // HISTÓRICO DE VENDAS — 90 DIAS POR (LOJA × PRODUTO)
    // Requisito mínimo do Prophet: 30 registros → geramos 90 por segurança
    // ================================================

    private void seedSalesHistory(List<Store> stores, List<Product> products) {
        List<SalesHistory> allSales = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            ProductData data = CATALOG.get(i);

            for (Store store : stores) {
                // Seed determinístico para reprodutibilidade entre restarts
                long seed = (long) store.getName().hashCode() * 31L + product.getEan().hashCode();
                Random rng = new Random(seed);

                for (int daysBack = 90; daysBack >= 1; daysBack--) {
                    LocalDate saleDay = today.minusDays(daysBack);

                    // Variação semanal realista de farmácia (pico na 2ª feira, mínimo no domingo)
                    double weekFactor = weekdayFactor(saleDay.getDayOfWeek());
                    int rawQty = data.dailyAvg() + rng.nextInt(data.variance() * 2 + 1) - data.variance();
                    int qty = Math.max(1, (int) Math.round(rawQty * weekFactor));

                    allSales.add(SalesHistory.builder()
                            .store(store)
                            .product(product)
                            .saleDate(saleDay.atTime(LocalTime.of(8 + rng.nextInt(10), rng.nextInt(60))))
                            .quantitySold(qty)
                            .unitPrice(product.getSalePrice())
                            .build());
                }
            }
        }

        salesHistoryRepository.saveAll(allSales);
        log.info("[SEEDER] {} registros de histórico de vendas criados (90 dias × {} produtos × {} lojas).",
                allSales.size(), products.size(), stores.size());
    }

    // ================================================
    // HELPERS
    // ================================================

    private InventoryLot lot(Store store, Product product, String batchNumber,
                             LocalDate expirationDate, int quantity) {
        return InventoryLot.builder()
                .store(store)
                .product(product)
                .batchNumber(batchNumber)
                .expirationDate(expirationDate)
                .quantity(quantity)
                .build();
    }

    private double weekdayFactor(DayOfWeek day) {
        return switch (day) {
            case MONDAY    -> 1.15;
            case TUESDAY   -> 1.05;
            case WEDNESDAY -> 1.00;
            case THURSDAY  -> 1.05;
            case FRIDAY    -> 1.10;
            case SATURDAY  -> 0.75;
            case SUNDAY    -> 0.45;
        };
    }
}
