package com.stockmind.domain.inventory;

import com.stockmind.domain.inventory.dto.InventoryLotRequestDTO;
import com.stockmind.domain.inventory.dto.InventoryLotResponseDTO;
import com.stockmind.domain.product.Product;
import com.stockmind.domain.product.ProductRepository;
import com.stockmind.domain.store.Store;
import com.stockmind.domain.store.StoreRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryLotService {

    private final InventoryLotRepository inventoryLotRepository;
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<InventoryLotResponseDTO> findByStore(UUID storeId) {
        return inventoryLotRepository.findAllByStoreId(storeId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InventoryLotResponseDTO> findByStoreAndProduct(UUID storeId, UUID productId) {
        return inventoryLotRepository.findAllByStoreIdAndProductId(storeId, productId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InventoryLotResponseDTO> findCriticalLots(int daysAhead) {
        LocalDate limitDate = LocalDate.now().plusDays(daysAhead);
        return inventoryLotRepository.findCriticalLots(limitDate)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public InventoryLotResponseDTO create(InventoryLotRequestDTO dto) {
        Store store = storeRepository.findByIdAndActiveTrue(dto.getStoreId())
                .orElseThrow(() -> new EntityNotFoundException("Loja não encontrada: " + dto.getStoreId()));

        Product product = productRepository.findByIdAndActiveTrue(dto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + dto.getProductId()));

        InventoryLot lot = InventoryLot.builder()
                .store(store)
                .product(product)
                .batchNumber(dto.getBatchNumber())
                .expirationDate(dto.getExpirationDate())
                .quantity(dto.getQuantity())
                .build();

        return toResponseDTO(inventoryLotRepository.save(lot));
    }

    @Transactional
    public InventoryLotResponseDTO updateQuantity(UUID id, Integer quantity) {
        InventoryLot lot = inventoryLotRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lote não encontrado: " + id));
        lot.setQuantity(quantity);
        return toResponseDTO(inventoryLotRepository.save(lot));
    }

    private InventoryLotResponseDTO toResponseDTO(InventoryLot lot) {
        return InventoryLotResponseDTO.builder()
                .id(lot.getId())
                .storeId(lot.getStore().getId())
                .storeName(lot.getStore().getName())
                .productId(lot.getProduct().getId())
                .productName(lot.getProduct().getName())
                .batchNumber(lot.getBatchNumber())
                .expirationDate(lot.getExpirationDate())
                .quantity(lot.getQuantity())
                .updatedAt(lot.getUpdatedAt())
                .build();
    }

}