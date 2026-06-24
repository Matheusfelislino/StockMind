package com.stockmind.api.inventory;

import com.stockmind.domain.inventory.InventoryLotService;
import com.stockmind.domain.inventory.dto.InventoryLotRequestDTO;
import com.stockmind.domain.inventory.dto.InventoryLotResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryLotService inventoryLotService;

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<InventoryLotResponseDTO>> findByStore(@PathVariable UUID storeId) {
        return ResponseEntity.ok(inventoryLotService.findByStore(storeId));
    }

    @GetMapping("/store/{storeId}/product/{productId}")
    public ResponseEntity<List<InventoryLotResponseDTO>> findByStoreAndProduct(
            @PathVariable UUID storeId,
            @PathVariable UUID productId) {
        return ResponseEntity.ok(inventoryLotService.findByStoreAndProduct(storeId, productId));
    }

    @GetMapping("/critical")
    public ResponseEntity<List<InventoryLotResponseDTO>> findCriticalLots(
            @RequestParam(defaultValue = "60") int daysAhead) {
        return ResponseEntity.ok(inventoryLotService.findCriticalLots(daysAhead));
    }

    @PostMapping
    public ResponseEntity<InventoryLotResponseDTO> create(
            @RequestBody @Valid InventoryLotRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryLotService.create(dto));
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<InventoryLotResponseDTO> updateQuantity(
            @PathVariable UUID id,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(inventoryLotService.updateQuantity(id, quantity));
    }

}