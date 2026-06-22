package br.com.mybudgets.service;

import br.com.mybudgets.domain.entity.Budget;
import br.com.mybudgets.domain.entity.Category;
import br.com.mybudgets.domain.entity.User;
import br.com.mybudgets.domain.enums.TransactionType;
import br.com.mybudgets.dto.request.BudgetRequest;
import br.com.mybudgets.dto.response.BudgetResponse;
import br.com.mybudgets.exception.BusinessException;
import br.com.mybudgets.exception.ResourceNotFoundException;
import br.com.mybudgets.mapper.BudgetAssembler;
import br.com.mybudgets.repository.BudgetRepository;
import br.com.mybudgets.repository.CategoryRepository;
import br.com.mybudgets.repository.TransactionRepository;
import br.com.mybudgets.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private BudgetAssembler budgetAssembler;

    @InjectMocks
    private BudgetService budgetService;

    @Test
    void shouldCreateBudgetSuccessfully() {
        // Arrange
        var userId = 1L;

        var user = User.builder()
                .id(userId)
                .name("João Silva")
                .email("joao@email.com")
                .password("hash")
                .build();

        var category = Category.builder()
                .id(1L)
                .user(user)
                .name("Alimentação")
                .color("#ef4444")
                .type(TransactionType.EXPENSE)
                .build();

        var request = new BudgetRequest(1L, BigDecimal.valueOf(1000.00), 6, 2026);

        var savedBudget = Budget.builder()
                .id(1L)
                .user(user)
                .category(category)
                .limitAmount(request.limitAmount())
                .month(request.month())
                .year(request.year())
                .build();

        var expectedResponse = new BudgetResponse(
                1L,
                BigDecimal.valueOf(1000.00),
                BigDecimal.valueOf(750.00),
                6,
                2026,
                new BudgetResponse.CategorySummary(
                        1L, "Alimentação", "#ef4444", TransactionType.EXPENSE
                )
        );

        when(budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(
                userId, 1L, 6, 2026))
                .thenReturn(false);

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(categoryRepository.findByIdAndUserId(1L, userId))
                .thenReturn(Optional.of(category));

        when(budgetRepository.save(any(Budget.class)))
                .thenReturn(savedBudget);

        when(transactionRepository.sumByUserIdAndTypeAndPeriod(
                userId, TransactionType.EXPENSE, 6, 2026))
                .thenReturn(BigDecimal.valueOf(750.00));

        when(budgetAssembler.toModel(savedBudget, BigDecimal.valueOf(750.00)))
                .thenReturn(expectedResponse);

        // Act
        BudgetResponse response = budgetService.create(userId, request);

        // Assert
        assertThat(response.getLimitAmount())
                .isEqualByComparingTo(BigDecimal.valueOf(1000.00));
        assertThat(response.getRealizedAmount())
                .isEqualByComparingTo(BigDecimal.valueOf(750.00));
        assertThat(response.getMonth()).isEqualTo(6);
        assertThat(response.getYear()).isEqualTo(2026);

        verify(budgetRepository).save(any(Budget.class));
        verify(transactionRepository).sumByUserIdAndTypeAndPeriod(
                userId, TransactionType.EXPENSE, 6, 2026);
        verify(budgetAssembler).toModel(savedBudget, BigDecimal.valueOf(750.00));
    }

    @Test
    void shouldThrowWhenBudgetAlreadyExistsForPeriod() {
        // Arrange
        var userId = 1L;
        var request = new BudgetRequest(1L, BigDecimal.valueOf(1000.00), 6, 2026);

        when(budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(
                userId, 1L, 6, 2026))
                .thenReturn(true);

        // Act & Assert
        assertThatThrownBy(() -> budgetService.create(userId, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Já existe um orçamento");

        verify(budgetRepository, never()).save(any());
        verify(transactionRepository, never()).sumByUserIdAndTypeAndPeriod(
                any(), any(), anyInt(), anyInt());
        verify(budgetAssembler, never()).toModel(any(), any());
    }
}