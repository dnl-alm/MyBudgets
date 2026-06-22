package br.com.mybudgets.dto.request;

import br.com.mybudgets.domain.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CategoryRequest(

        @NotBlank(message = "Nome é obrigatório")
        @Size(max = 80, message = "Nome deve ter no máximo 80 caracteres")
        String name,

        @NotBlank(message = "Cor é obrigatória")
        @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "Cor deve ser um hex válido ex: #6366f1")
        String color,

        @NotNull(message = "Tipo é obrigatório")
        TransactionType type
) {}