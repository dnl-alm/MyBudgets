package br.com.mybudgets.dto.response;

import br.com.mybudgets.domain.enums.TransactionType;
import java.math.BigDecimal;
import java.util.List;

public record CategoryReportResponse(
        TransactionType type,
        BigDecimal total,
        List<CategoryItem> items
) {
    public record CategoryItem(
            Long categoryId,
            String categoryName,
            String color,
            BigDecimal amount,
            BigDecimal percentage
    ) {}
}