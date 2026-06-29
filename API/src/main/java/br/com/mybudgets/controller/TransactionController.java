package br.com.mybudgets.controller;

import br.com.mybudgets.domain.entity.Transaction;
import br.com.mybudgets.domain.enums.TransactionType;
import br.com.mybudgets.dto.request.TransactionRequest;
import br.com.mybudgets.dto.response.TransactionResponse;
import br.com.mybudgets.mapper.TransactionAssembler;
import br.com.mybudgets.security.SecurityUtils;
import br.com.mybudgets.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
@Tag(name = "Transações", description = "Gerenciamento de transações financeiras")
public class TransactionController {

    private final TransactionService transactionService;
    private final SecurityUtils securityUtils;
    private final PagedResourcesAssembler<Transaction> pagedResourcesAssembler;
    private final TransactionAssembler transactionAssembler;

    @Operation(
            summary = "Listar transações",
            description = "Retorna as transações do usuário com paginação e filtros opcionais"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping
    public ResponseEntity<PagedModel<TransactionResponse>> findAll(
            @Parameter(description = "Mês de referência (1-12)", example = "6")
            @RequestParam(required = false) Integer month,
            @Parameter(description = "Ano de referência", example = "2026")
            @RequestParam(required = false) Integer year,
            @Parameter(description = "Tipo da transação", example = "EXPENSE")
            @RequestParam(required = false) TransactionType type,
            @Parameter(description = "ID da categoria", example = "1")
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 20, sort = "date", direction = Sort.Direction.DESC)
            Pageable pageable) {
        Long userId = securityUtils.getCurrentUserId();
        var page = transactionService.findAll(userId, month, year, type, categoryId, pageable);
        return ResponseEntity.ok(pagedResourcesAssembler.toModel(page, transactionAssembler::toModel));
    }

    @Operation(summary = "Buscar transação", description = "Retorna uma transação pelo ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transação encontrada"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Transação não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> findById(
            @Parameter(description = "ID da transação", example = "1")
            @PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(transactionService.findById(id, userId));
    }

    @Operation(summary = "Criar transação", description = "Registra uma nova transação financeira")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Transação criada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada"),
            @ApiResponse(responseCode = "422", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<TransactionResponse> create(
            @RequestBody @Valid TransactionRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.create(userId, request));
    }

    @Operation(summary = "Atualizar transação", description = "Atualiza uma transação existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Transação atualizada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Transação ou categoria não encontrada"),
            @ApiResponse(responseCode = "422", description = "Dados inválidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(
            @Parameter(description = "ID da transação", example = "1")
            @PathVariable Long id,
            @RequestBody @Valid TransactionRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(transactionService.update(id, userId, request));
    }

    @Operation(summary = "Deletar transação", description = "Remove uma transação do usuário")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Transação removida com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado"),
            @ApiResponse(responseCode = "404", description = "Transação não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID da transação", example = "1")
            @PathVariable Long id) {
        Long userId = securityUtils.getCurrentUserId();
        transactionService.delete(id, userId);
        return ResponseEntity.noContent().build();
    }
}