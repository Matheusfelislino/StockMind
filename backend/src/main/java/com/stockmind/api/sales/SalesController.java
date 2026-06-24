package com.stockmind.api.sales;

import com.stockmind.domain.sales.SalesHistoryService;
import com.stockmind.domain.sales.dto.SalesHistoryRequestDTO;
import com.stockmind.domain.sales.dto.SalesHistoryResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesHistoryService salesHistoryService;

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<SalesHistoryResponseDTO>> findByStoreAndPeriod(
            @PathVariable UUID storeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(salesHistoryService.findByStoreAndPeriod(storeId, start, end));
    }

    @GetMapping("/store/{storeId}/product/{productId}")
    public ResponseEntity<List<SalesHistoryResponseDTO>> findByStoreAndProduct(
            @PathVariable UUID storeId,
            @PathVariable UUID productId) {
        return ResponseEntity.ok(salesHistoryService.findByStoreAndProduct(storeId, productId));
    }

    @PostMapping
    public ResponseEntity<SalesHistoryResponseDTO> create(
            @RequestBody @Valid SalesHistoryRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salesHistoryService.create(dto));
    }

    @PostMapping("/batch")
    public ResponseEntity<Void> createBatch(
            @RequestBody @Valid List<SalesHistoryRequestDTO> dtos) {
        salesHistoryService.createBatch(dtos);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}