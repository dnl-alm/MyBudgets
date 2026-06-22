package br.com.mybudgets.controller;

import br.com.mybudgets.dto.request.CategoryRequest;
import br.com.mybudgets.dto.response.CategoryResponse;
import br.com.mybudgets.security.SecurityUtils;
import br.com.mybudgets.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Categorias", description = "Gerenciamento de categorias do usuário")
public class CategoryController {

    private final CategoryService categoryService;
    private final SecurityUtils securityUtils;

    @Operation(summary = "Listar categorias", description = "Retorna todas as categorias do usuário autenticado")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping
    public ResponseEntity<CollectionModel<CategoryResponse>> findAll() {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(categoryService.findAll(userId));
    }

    @Operation(summary = "Buscar categoria", description = "Retorna uma categoria pelo ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria encontrada"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> findById(
            @Parameter(description = "ID da categoria", example = "1")
            @PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(categoryService.findById(id, userId));
    }

    @Operation(summary = "Criar categoria", description = "Cria uma nova categoria para o usuário autenticado")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Categoria criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Já existe uma categoria com esse nome"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "422", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<CategoryResponse> create(@RequestBody @Valid CategoryRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.create(userId, request));
    }

    @Operation(summary = "Atualizar categoria", description = "Atualiza uma categoria existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria atualizada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Já existe uma categoria com esse nome"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada"),
            @ApiResponse(responseCode = "422", description = "Dados inválidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> update(
            @Parameter(description = "ID da categoria", example = "1")
            @PathVariable Long id,
            @RequestBody @Valid CategoryRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(categoryService.update(id, userId, request));
    }

    @Operation(summary = "Deletar categoria", description = "Remove uma categoria do usuário")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Categoria removida com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID da categoria", example = "1")
            @PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        categoryService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}