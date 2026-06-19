package br.com.mybudgets.controller;

import br.com.mybudgets.domain.entity.Transaction;
import br.com.mybudgets.domain.enums.TransactionType;
import br.com.mybudgets.dto.request.TransactionRequest;
import br.com.mybudgets.dto.response.TransactionResponse;
import br.com.mybudgets.mapper.TransactionAssembler;
import br.com.mybudgets.security.SecurityUtils;
import br.com.mybudgets.service.TransactionService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    private final TransactionService transactionService;
    private final SecurityUtils securityUtils;
    private final PagedResourcesAssembler<Transaction> pagedResourcesAssembler;
    private final TransactionAssembler transactionAssembler;

    @GetMapping
    public ResponseEntity<PagedModel<TransactionResponse>> findAll(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 20, sort = "date", direction = Sort.Direction.DESC) Pageable pageable) {

        Long userId = securityUtils.getCurrentUserId();
        var page = transactionService.findAll(userId, month, year, type, categoryId, pageable);
        return ResponseEntity.ok(pagedResourcesAssembler.toModel(page, transactionAssembler::toModel));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> findById(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(transactionService.findById(id, userId));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@RequestBody @Valid TransactionRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.create(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid TransactionRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(transactionService.update(id, userId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        transactionService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}