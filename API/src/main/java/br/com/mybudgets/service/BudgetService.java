package br.com.mybudgets.service;

import br.com.mybudgets.domain.entity.Budget;
import br.com.mybudgets.dto.request.BudgetRequest;
import br.com.mybudgets.dto.response.BudgetResponse;
import br.com.mybudgets.exception.BusinessException;
import br.com.mybudgets.exception.ResourceNotFoundException;
import br.com.mybudgets.mapper.BudgetAssembler;
import br.com.mybudgets.repository.BudgetRepository;
import br.com.mybudgets.repository.CategoryRepository;
import br.com.mybudgets.repository.TransactionRepository;
import br.com.mybudgets.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetAssembler budgetAssembler;

    @Transactional(readOnly = true)
    public CollectionModel<BudgetResponse> findAll(Long userId, Integer month, Integer year) {
        var budgets = budgetRepository.findAllByUserIdAndMonthAndYear(userId, month, year);

        if (budgets.isEmpty()) {
            return budgetAssembler.toCollectionModel(budgets, Map.of());
        }

        List<Long> categoryIds = budgets.stream()
                .map(b -> b.getCategory().getId())
                .toList();

        Map<Long, BigDecimal> realizedByCategory = transactionRepository
                .sumByCategoryIdsAndPeriod(userId, month, year, categoryIds)
                .stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (BigDecimal) row[1]
                ));

        Map<Long, BigDecimal> realizedAmounts = budgets.stream()
                .collect(Collectors.toMap(
                        Budget::getId,
                        budget -> realizedByCategory.getOrDefault(
                                budget.getCategory().getId(),
                                BigDecimal.ZERO
                        )
                ));

        return budgetAssembler.toCollectionModel(budgets, realizedAmounts);
    }

    @Transactional(readOnly = true)
    public BudgetResponse findById(Long id, Long userId) {
        var budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Orçamento", id));

        BigDecimal realizedAmount = transactionRepository.sumByUserIdAndTypeAndPeriod(
                userId,
                budget.getCategory().getType(),
                budget.getMonth(),
                budget.getYear()
        );

        return budgetAssembler.toModel(budget, realizedAmount);
    }

    @Transactional
    public BudgetResponse create(Long userId, BudgetRequest request) {
        if (budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(
                userId, request.categoryId(), request.month(), request.year())) {
            throw new BusinessException(
                    "Já existe um orçamento para essa categoria nesse período"
            );
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", userId));

        var category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.categoryId()));

        var budget = Budget.builder()
                .user(user)
                .category(category)
                .limitAmount(request.limitAmount())
                .month(request.month())
                .year(request.year())
                .build();

        var saved = budgetRepository.save(budget);

        BigDecimal realizedAmount = transactionRepository.sumByUserIdAndTypeAndPeriod(
                userId,
                category.getType(),
                request.month(),
                request.year()
        );

        return budgetAssembler.toModel(saved, realizedAmount);
    }

    @Transactional
    public BudgetResponse update(Long id, Long userId, BudgetRequest request) {
        var budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Orçamento", id));

        var category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.categoryId()));

        if (budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(
                userId, request.categoryId(), request.month(), request.year())
                && !budget.getCategory().getId().equals(request.categoryId())) {
            throw new BusinessException(
                    "Já existe um orçamento para essa categoria nesse período"
            );
        }

        budget.setCategory(category);
        budget.setLimitAmount(request.limitAmount());
        budget.setMonth(request.month());
        budget.setYear(request.year());

        var saved = budgetRepository.save(budget);

        BigDecimal realizedAmount = transactionRepository.sumByUserIdAndTypeAndPeriod(
                userId,
                category.getType(),
                request.month(),
                request.year()
        );

        return budgetAssembler.toModel(saved, realizedAmount);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        var budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Orçamento", id));
        budgetRepository.delete(budget);
    }
}