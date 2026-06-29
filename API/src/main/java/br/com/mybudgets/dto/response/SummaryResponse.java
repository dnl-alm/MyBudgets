package br.com.mybudgets.dto.response;

import java.math.BigDecimal;

public record SummaryResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        Integer month,
        Integer year
) {}