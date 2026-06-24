package com.stockmind.api.product;

import com.stockmind.domain.product.CurveCategory;
import com.stockmind.domain.product.ProductService;
import com.stockmind.domain.product.dto.ProductRequestDTO;
import com.stockmind.domain.product.dto.ProductResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> findAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @GetMapping("/ean/{ean}")
    public ResponseEntity<ProductResponseDTO> findByEan(@PathVariable String ean) {
        return ResponseEntity.ok(productService.findByEan(ean));
    }

    @GetMapping("/curve/{category}")
    public ResponseEntity<List<ProductResponseDTO>> findByCurveCategory(
            @PathVariable CurveCategory category) {
        return ResponseEntity.ok(productService.findByCurveCategory(category));
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> create(@RequestBody @Valid ProductRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> update(
            @PathVariable UUID id,
            @RequestBody @Valid ProductRequestDTO dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

}