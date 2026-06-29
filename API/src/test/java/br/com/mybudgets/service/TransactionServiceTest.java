package br.com.mybudgets.service;

import br.com.mybudgets.domain.entity.Category;
import br.com.mybudgets.domain.entity.Transaction;
import br.com.mybudgets.domain.entity.User;
import br.com.mybudgets.domain.enums.TransactionType;
import br.com.mybudgets.dto.request.TransactionRequest;
import br.com.mybudgets.dto.response.TransactionResponse;
import br.com.mybudgets.exception.ResourceNotFoundException;
import br.com.mybudgets.mapper.TransactionAssembler;
import br.com.mybudgets.repository.CategoryRepository;
import br.com.mybudgets.repository.TransactionRepository;
import br.com.mybudgets.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TransactionAssembler transactionAssembler;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    void shouldCreateTransactionSuccessfully() {
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

        var request = new TransactionRequest(
                BigDecimal.valueOf(50.00),
                "Almoço",
                LocalDate.now(),
                TransactionType.EXPENSE,
                1L
        );

        var transaction = Transaction.builder()
                .id(1L)
                .user(user)
                .category(category)
                .amount(request.amount())
                .description(request.description())
                .date(request.date())
                .type(request.type())
                .build();

        var expectedResponse = new TransactionResponse(
                1L,
                BigDecimal.valueOf(50.00),
                "Almoço",
                LocalDate.now(),
                TransactionType.EXPENSE,
                new TransactionResponse.CategorySummary(
                        1L, "Alimentação", "#ef4444", TransactionType.EXPENSE
                ),
                LocalDateTime.now()
        );

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(categoryRepository.findByIdAndUserId(1L, userId))
                .thenReturn(Optional.of(category));

        when(transactionRepository.save(any(Transaction.class)))
                .thenReturn(transaction);

        when(transactionAssembler.toModel(transaction))
                .thenReturn(expectedResponse);

        // Act
        TransactionResponse response = transactionService.create(userId, request);

        // Assert
        assertThat(response.getAmount()).isEqualByComparingTo(BigDecimal.valueOf(50.00));
        assertThat(response.getDescription()).isEqualTo("Almoço");
        assertThat(response.getType()).isEqualTo(TransactionType.EXPENSE);
        assertThat(response.getCategory().name()).isEqualTo("Alimentação");

        verify(transactionRepository).save(any(Transaction.class));
        verify(transactionAssembler).toModel(transaction);
    }

    @Test
    void shouldThrowWhenCategoryNotFoundOnCreate() {
        // Arrange
        var userId = 1L;

        var user = User.builder()
                .id(userId)
                .name("João Silva")
                .email("joao@email.com")
                .password("hash")
                .build();

        var request = new TransactionRequest(
                BigDecimal.valueOf(50.00),
                "Almoço",
                LocalDate.now(),
                TransactionType.EXPENSE,
                99L
        );

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        when(categoryRepository.findByIdAndUserId(99L, userId))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> transactionService.create(userId, request))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(transactionRepository, never()).save(any());
        verify(transactionAssembler, never()).toModel(any());
    }

    @Test
    void shouldFindAllTransactionsSuccessfully() {
        // Arrange
        var userId = 1L;
        var pageable = PageRequest.of(0, 20);

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

        var transaction = Transaction.builder()
                .id(1L)
                .user(user)
                .category(category)
                .amount(BigDecimal.valueOf(50.00))
                .description("Almoço")
                .date(LocalDate.now())
                .type(TransactionType.EXPENSE)
                .build();

        var page = new PageImpl<>(List.of(transaction), pageable, 1);

        when(transactionRepository.findAll(any(Specification.class), eq(pageable)))
                .thenReturn(page);

        // Act
        var result = transactionService.findAll(userId, null, null, null, null, pageable);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);

        verify(transactionRepository).findAll(any(Specification.class), eq(pageable));
    }
}