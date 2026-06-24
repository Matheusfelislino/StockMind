package com.stockmind.domain.sales;

import com.stockmind.domain.product.Product;
import com.stockmind.domain.product.ProductRepository;
import com.stockmind.domain.sales.dto.SalesHistoryRequestDTO;
import com.stockmind.domain.sales.dto.SalesHistoryResponseDTO;
import com.stockmind.domain.store.Store;
import com.stockmind.domain.store.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SalesHistoryService {

    private final SalesHistoryRepository salesHistoryRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<SalesHistoryResponseDTO> findByStoreAndPeriod(
            UUID storeId,
            LocalDateTime start,
            LocalDateTime end) {

        return salesHistoryRepository.findByStoreAndPeriod(storeId, start, end)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SalesHistoryResponseDTO> findByStoreAndProduct(UUID storeId, UUID productId) {
        return salesHistoryRepository.findAllByStoreIdAndProductId(storeId, productId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public SalesHistoryResponseDTO create(SalesHistoryRequestDTO dto) {
        Store store = storeRepository.findByIdAndActiveTrue(dto.getStoreId())
                .orElseThrow(() -> new EntityNotFoundException("Loja não encontrada: " + dto.getStoreId()));

        Product product = productRepository.findByIdAndActiveTrue(dto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + dto.getProductId()));

        SalesHistory sale = SalesHistory.builder()
                .store(store)
                .product(product)
                .saleDate(dto.getSaleDate())
                .quantitySold(dto.getQuantitySold())
                .unitPrice(dto.getUnitPrice())
                .build();

        return toResponseDTO(salesHistoryRepository.save(sale));
    }

    @Transactional
    public void createBatch(List<SalesHistoryRequestDTO> dtos) {
        List<SalesHistory> sales = dtos.stream().map(dto -> {
            Store store = storeRepository.findByIdAndActiveTrue(dto.getStoreId())
                    .orElseThrow(() -> new EntityNotFoundException("Loja não encontrada: " + dto.getStoreId()));

            Product product = productRepository.findByIdAndActiveTrue(dto.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + dto.getProductId()));

            return SalesHistory.builder()
                    .store(store)
                    .product(product)
                    .saleDate(dto.getSaleDate())
                    .quantitySold(dto.getQuantitySold())
                    .unitPrice(dto.getUnitPrice())
                    .build();
        }).toList();

        salesHistoryRepository.saveAll(sales);
    }

    private SalesHistoryResponseDTO toResponseDTO(SalesHistory sale) {
        BigDecimal totalValue = sale.getUnitPrice()
                .multiply(BigDecimal.valueOf(sale.getQuantitySold()));

        return SalesHistoryResponseDTO.builder()
                .id(sale.getId())
                .storeId(sale.getStore().getId())
                .storeName(sale.getStore().getName())
                .productId(sale.getProduct().getId())
                .productName(sale.getProduct().getName())
                .saleDate(sale.getSaleDate())
                .quantitySold(sale.getQuantitySold())
                .unitPrice(sale.getUnitPrice())
                .totalValue(totalValue)
                .build();
    }

}