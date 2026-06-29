package com.stockmind.domain.product;

import com.stockmind.domain.product.dto.ProductRequestDTO;
import com.stockmind.domain.product.dto.ProductResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findAll() {
        return productRepository.findAllByActiveTrue()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO findById(UUID id) {
        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + id));
        return toResponseDTO(product);
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO findByEan(String ean) {
        Product product = productRepository.findByEanAndActiveTrue(ean)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado para EAN: " + ean));
        return toResponseDTO(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findByCurveCategory(CurveCategory curveCategory) {
        return productRepository.findAllByCurveCategoryAndActiveTrue(curveCategory)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public ProductResponseDTO create(ProductRequestDTO dto) {
        productRepository.findByEanAndActiveTrue(dto.getEan()).ifPresent(p -> {
            throw new IllegalArgumentException("Já existe um produto com o EAN: " + dto.getEan());
        });

        Product product = Product.builder()
                .ean(dto.getEan())
                .name(dto.getName())
                .curveCategory(dto.getCurveCategory())
                .costPrice(dto.getCostPrice())
                .salePrice(dto.getSalePrice())
                .build();

        return toResponseDTO(productRepository.save(product));
    }

    @Transactional
    public ProductResponseDTO update(UUID id, ProductRequestDTO dto) {
        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + id));

        product.setEan(dto.getEan());
        product.setName(dto.getName());
        product.setCurveCategory(dto.getCurveCategory());
        product.setCostPrice(dto.getCostPrice());
        product.setSalePrice(dto.getSalePrice());

        return toResponseDTO(productRepository.save(product));
    }

    @Transactional
    public void delete(UUID id) {
        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    private ProductResponseDTO toResponseDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .ean(product.getEan())
                .name(product.getName())
                .curveCategory(product.getCurveCategory())
                .costPrice(product.getCostPrice())
                .salePrice(product.getSalePrice())
                .active(product.getActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

} 