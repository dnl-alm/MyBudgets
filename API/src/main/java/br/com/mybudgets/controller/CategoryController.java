package br.com.mybudgets.controller;

import br.com.mybudgets.dto.request.CategoryRequest;
import br.com.mybudgets.dto.response.CategoryResponse;
import br.com.mybudgets.security.SecurityUtils;
import br.com.mybudgets.service.CategoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class CategoryController {

    private final CategoryService categoryService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<CollectionModel<CategoryResponse>> findAll() {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(categoryService.findAll(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> findById(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(categoryService.findById(id, userId));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@RequestBody @Valid CategoryRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.create(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid CategoryRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(categoryService.update(id, userId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        categoryService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}