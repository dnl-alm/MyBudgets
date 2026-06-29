package br.com.mybudgets.service;

import br.com.mybudgets.domain.enums.TransactionType;
import br.com.mybudgets.dto.response.CategoryReportResponse;
import br.com.mybudgets.dto.response.EvolutionResponse;
import br.com.mybudgets.dto.response.SummaryResponse;
import br.com.mybudgets.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public SummaryResponse getSummary(Long userId, Integer month, Integer year) {
        var rows = transactionRepository.sumByTypeAndPeriod(userId, month, year);

        BigDecimal totalIncome = BigDecimal.ZERO;
        BigDecimal totalExpense = BigDecimal.ZERO;

        for (Object[] row : rows) {
            TransactionType type = (TransactionType) row[2];
            BigDecimal amount = (BigDecimal) row[3];

            if (type == TransactionType.INCOME) {
                totalIncome = amount;
            } else {
                totalExpense = amount;
            }
        }

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new SummaryResponse(totalIncome, totalExpense, balance, month, year);
    }

    @Transactional(readOnly = true)
    public CategoryReportResponse getByCategory(
            Long userId, Integer month, Integer year, TransactionType type) {

        var rows = transactionRepository.sumByCategoryAndTypeAndPeriod(
                userId, type, month, year);

        BigDecimal total = rows.stream()
                .map(row -> (BigDecimal) row[3])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CategoryReportResponse.CategoryItem> items = rows.stream()
                .map(row -> {
                    Long categoryId = (Long) row[0];
                    String categoryName = (String) row[1];
                    String color = (String) row[2];
                    BigDecimal amount = (BigDecimal) row[3];

                    BigDecimal percentage = total.compareTo(BigDecimal.ZERO) == 0
                            ? BigDecimal.ZERO
                            : amount.divide(total, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100))
                            .setScale(2, RoundingMode.HALF_UP);

                    return new CategoryReportResponse.CategoryItem(
                            categoryId, categoryName, color, amount, percentage
                    );
                })
                .toList();

        return new CategoryReportResponse(type, total, items);
    }

    @Transactional(readOnly = true)
    public EvolutionResponse getEvolution(
            Long userId,
            Integer startMonth, Integer startYear,
            Integer endMonth, Integer endYear) {

        var rows = transactionRepository.sumByTypeAndEvolution(
                userId, startMonth, startYear, endMonth, endYear);

        Map<String, BigDecimal[]> periodMap = new HashMap<>();

        for (Object[] row : rows) {
            Integer month = (Integer) row[0];
            Integer year = (Integer) row[1];
            TransactionType type = (TransactionType) row[2];
            BigDecimal amount = (BigDecimal) row[3];

            String key = year + "-" + month;
            periodMap.computeIfAbsent(key, k -> new BigDecimal[]{
                    BigDecimal.ZERO, BigDecimal.ZERO
            });

            if (type == TransactionType.INCOME) {
                periodMap.get(key)[0] = amount;
            } else {
                periodMap.get(key)[1] = amount;
            }
        }

        List<EvolutionResponse.EvolutionItem> items = new ArrayList<>();
        int currentMonth = startMonth;
        int currentYear = startYear;

        while (currentYear < endYear ||
                (currentYear == endYear && currentMonth <= endMonth)) {
            String key = currentYear + "-" + currentMonth;
            BigDecimal[] totals = periodMap.getOrDefault(
                    key, new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO}
            );

            BigDecimal totalIncome = totals[0];
            BigDecimal totalExpense = totals[1];
            BigDecimal balance = totalIncome.subtract(totalExpense);

            items.add(new EvolutionResponse.EvolutionItem(
                    currentMonth, currentYear, totalIncome, totalExpense, balance
            ));

            if (currentMonth == 12) {
                currentMonth = 1;
                currentYear++;
            } else {
                currentMonth++;
            }
        }

        return new EvolutionResponse(items);
    }
}