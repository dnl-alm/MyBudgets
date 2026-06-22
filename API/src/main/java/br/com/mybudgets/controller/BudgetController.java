package br.com.mybudgets.controller;

import br.com.mybudgets.dto.request.BudgetRequest;
import br.com.mybudgets.dto.response.BudgetResponse;
import br.com.mybudgets.security.SecurityUtils;
import br.com.mybudgets.service.BudgetService;
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
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Orçamentos", description = "Gerenciamento de orçamentos mensais por categoria")
public class BudgetController {

    private final BudgetService budgetService;
    private final SecurityUtils securityUtils;

    @Operation(
            summary = "Listar orçamentos",
            description = "Retorna os orçamentos do usuário para o mês e ano informados"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping
    public ResponseEntity<CollectionModel<BudgetResponse>> findAll(
            @Parameter(description = "Mês de referência (1-12)", example = "6")
            @RequestParam Integer month,
            @Parameter(description = "Ano de referência", example = "2026")
            @RequestParam Integer year) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(budgetService.findAll(userId, month, year));
    }

    @Operation(summary = "Buscar orçamento", description = "Retorna um orçamento pelo ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Orçamento encontrado"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Orçamento não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<BudgetResponse> findById(
            @Parameter(description = "ID do orçamento", example = "1")
            @PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(budgetService.findById(id, userId));
    }

    @Operation(summary = "Criar orçamento", description = "Cria um novo orçamento para uma categoria no período informado")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Orçamento criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Já existe um orçamento para essa categoria nesse período"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada"),
            @ApiResponse(responseCode = "422", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<BudgetResponse> create(@RequestBody @Valid BudgetRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(budgetService.create(userId, request));
    }

    @Operation(summary = "Atualizar orçamento", description = "Atualiza um orçamento existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Orçamento atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Já existe um orçamento para essa categoria nesse período"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Orçamento ou categoria não encontrada"),
            @ApiResponse(responseCode = "422", description = "Dados inválidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<BudgetResponse> update(
            @Parameter(description = "ID do orçamento", example = "1")
            @PathVariable Long id,
            @RequestBody @Valid BudgetRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(budgetService.update(id, userId, request));
    }

    @Operation(summary = "Deletar orçamento", description = "Remove um orçamento do usuário")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Orçamento removido com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Orçamento não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do orçamento", example = "1")
            @PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        budgetService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}