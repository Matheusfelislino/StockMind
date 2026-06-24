package com.stockmind.domain.store.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StoreRequestDTO {

    @NotBlank(message = "Nome da loja é obrigatório")
    private String name;

    @NotBlank(message = "Nome do gerente é obrigatório")
    private String managerName;

}