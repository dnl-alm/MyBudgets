package br.com.mybudgets.dto.response;

import java.math.BigDecimal;
import java.util.List;

public record EvolutionResponse(
        List<EvolutionItem> items
) {
    public record EvolutionItem(
            Integer month,
            Integer year,
            BigDecimal totalIncome,
            BigDecimal totalExpense,
            BigDecimal balance
    ) {}
}