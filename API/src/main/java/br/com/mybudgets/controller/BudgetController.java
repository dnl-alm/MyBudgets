package br.com.mybudgets.controller;

import br.com.mybudgets.dto.request.BudgetRequest;
import br.com.mybudgets.dto.response.BudgetResponse;
import br.com.mybudgets.security.SecurityUtils;
import br.com.mybudgets.service.BudgetService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class BudgetController {

    private final BudgetService budgetService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<CollectionModel<BudgetResponse>> findAll(
            @RequestParam Integer month,
            @RequestParam Integer year) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(budgetService.findAll(userId, month, year));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponse> findById(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(budgetService.findById(id, userId));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> create(@RequestBody @Valid BudgetRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(budgetService.create(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid BudgetRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(budgetService.update(id, userId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        budgetService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}