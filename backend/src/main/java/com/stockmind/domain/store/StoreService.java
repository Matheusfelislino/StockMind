package com.stockmind.domain.store;

import com.stockmind.domain.store.dto.StoreRequestDTO;
import com.stockmind.domain.store.dto.StoreResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;

    @Transactional(readOnly = true)
    public List<StoreResponseDTO> findAll() {
        return storeRepository.findAllByActiveTrue()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public StoreResponseDTO findById(UUID id) {
        Store store = storeRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Loja não encontrada: " + id));
        return toResponseDTO(store);
    }

    @Transactional
    public StoreResponseDTO create(StoreRequestDTO dto) {
        Store store = Store.builder()
                .name(dto.getName())
                .managerName(dto.getManagerName())
                .build();
        return toResponseDTO(storeRepository.save(store));
    }

    @Transactional
    public StoreResponseDTO update(UUID id, StoreRequestDTO dto) {
        Store store = storeRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Loja não encontrada: " + id));
        store.setName(dto.getName());
        store.setManagerName(dto.getManagerName());
        return toResponseDTO(storeRepository.save(store));
    }

    @Transactional
    public void delete(UUID id) {
        Store store = storeRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Loja não encontrada: " + id));
        store.setActive(false);
        storeRepository.save(store);
    }

    private StoreResponseDTO toResponseDTO(Store store) {
        return StoreResponseDTO.builder()
                .id(store.getId())
                .name(store.getName())
                .managerName(store.getManagerName())
                .active(store.getActive())
                .createdAt(store.getCreatedAt())
                .updatedAt(store.getUpdatedAt())
                .build();
    }

}