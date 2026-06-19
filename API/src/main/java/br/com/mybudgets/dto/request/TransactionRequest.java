package br.com.mybudgets.dto.request;

import br.com.mybudgets.domain.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(

        @NotNull(message = "Valor é obrigatório")
        @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
        @Digits(integer = 13, fraction = 2, message = "Valor inválido")
        BigDecimal amount,

        @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
        String description,

        @NotNull(message = "Data é obrigatória")
        LocalDate date,

        @NotNull(message = "Tipo é obrigatório")
        TransactionType type,

        @NotNull(message = "Categoria é obrigatória")
        Long categoryId
) {}