package com.stockmind.api.store;

import com.stockmind.domain.store.StoreService;
import com.stockmind.domain.store.dto.StoreRequestDTO;
import com.stockmind.domain.store.dto.StoreResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<List<StoreResponseDTO>> findAll() {
        return ResponseEntity.ok(storeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(storeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<StoreResponseDTO> create(@RequestBody @Valid StoreRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storeService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StoreResponseDTO> update(
            @PathVariable UUID id,
            @RequestBody @Valid StoreRequestDTO dto) {
        return ResponseEntity.ok(storeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        storeService.delete(id);
        return ResponseEntity.noContent().build();
    }

}