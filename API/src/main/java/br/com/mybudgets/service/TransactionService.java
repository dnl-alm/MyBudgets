package br.com.mybudgets.service;

import br.com.mybudgets.domain.entity.Transaction;
import br.com.mybudgets.domain.enums.TransactionType;
import br.com.mybudgets.dto.request.TransactionRequest;
import br.com.mybudgets.dto.response.TransactionResponse;
import br.com.mybudgets.exception.ResourceNotFoundException;
import br.com.mybudgets.mapper.TransactionAssembler;
import br.com.mybudgets.repository.CategoryRepository;
import br.com.mybudgets.repository.TransactionRepository;
import br.com.mybudgets.repository.UserRepository;
import br.com.mybudgets.specification.TransactionSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionAssembler transactionAssembler;

    @Transactional(readOnly = true)
    public Page<Transaction> findAll(
            Long userId,
            Integer month,
            Integer year,
            TransactionType type,
            Long categoryId,
            Pageable pageable) {

        Specification<Transaction> spec = TransactionSpecification.hasUser(userId)
                .and(TransactionSpecification.fetchCategory());

        if (month != null) {
            spec = spec.and(TransactionSpecification.hasMonth(month));
        }
        if (year != null) {
            spec = spec.and(TransactionSpecification.hasYear(year));
        }
        if (type != null) {
            spec = spec.and(TransactionSpecification.hasType(type));
        }
        if (categoryId != null) {
            spec = spec.and(TransactionSpecification.hasCategory(categoryId));
        }

        return transactionRepository.findAll(spec, pageable);
    }

    @Transactional(readOnly = true)
    public TransactionResponse findById(Long id, Long userId) {
        var transaction = transactionRepository.findByIdAndUserIdWithCategory(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transação", id));
        return transactionAssembler.toModel(transaction);
    }

    @Transactional
    public TransactionResponse create(Long userId, TransactionRequest request) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", userId));

        var category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.categoryId()));

        var transaction = Transaction.builder()
                .user(user)
                .category(category)
                .amount(request.amount())
                .description(request.description())
                .date(request.date())
                .type(request.type())
                .build();

        return transactionAssembler.toModel(transactionRepository.save(transaction));
    }

    @Transactional
    public TransactionResponse update(Long id, Long userId, TransactionRequest request) {
        var transaction = transactionRepository.findByIdAndUserIdWithCategory(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transação", id));

        var category = categoryRepository.findByIdAndUserId(request.categoryId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", request.categoryId()));

        transaction.setAmount(request.amount());
        transaction.setDescription(request.description());
        transaction.setDate(request.date());
        transaction.setType(request.type());
        transaction.setCategory(category);

        return transactionAssembler.toModel(transactionRepository.save(transaction));
    }

    @Transactional
    public void delete(Long id, Long userId) {
        var transaction = transactionRepository.findByIdAndUserIdWithCategory(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transação", id));
        transactionRepository.delete(transaction);
    }

}