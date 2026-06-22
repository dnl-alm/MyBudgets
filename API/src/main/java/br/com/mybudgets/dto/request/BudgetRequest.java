package br.com.mybudgets.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record BudgetRequest(

        @NotNull(message = "Categoria é obrigatória")
        Long categoryId,

        @NotNull(message = "Valor limite é obrigatório")
        @DecimalMin(value = "0.01", message = "Valor limite deve ser maior que zero")
        @Digits(integer = 13, fraction = 2, message = "Valor inválido")
        BigDecimal limitAmount,

        @NotNull(message = "Mês é obrigatório")
        @Min(value = 1, message = "Mês deve ser entre 1 e 12")
        @Max(value = 12, message = "Mês deve ser entre 1 e 12")
        Integer month,

        @NotNull(message = "Ano é obrigatório")
        @Min(value = 2000, message = "Ano inválido")
        Integer year
) {}