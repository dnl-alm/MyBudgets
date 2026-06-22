package br.com.mybudgets.controller;

import br.com.mybudgets.domain.enums.TransactionType;
import br.com.mybudgets.dto.response.CategoryReportResponse;
import br.com.mybudgets.dto.response.EvolutionResponse;
import br.com.mybudgets.dto.response.SummaryResponse;
import br.com.mybudgets.security.SecurityUtils;
import br.com.mybudgets.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Validated
@Tag(name = "Relatórios", description = "Relatórios financeiros do usuário")
public class ReportController {

    private final ReportService reportService;
    private final SecurityUtils securityUtils;

    @Operation(
            summary = "Resumo mensal",
            description = "Retorna o total de receitas, despesas e saldo do mês informado"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resumo retornado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse> getSummary(
            @Parameter(description = "Mês de referência (1-12)", example = "6")
            @RequestParam @Min(1) @Max(12) Integer month,
            @Parameter(description = "Ano de referência", example = "2026")
            @RequestParam Integer year) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(reportService.getSummary(userId, month, year));
    }

    @Operation(
            summary = "Breakdown por categoria",
            description = "Retorna o total de receitas ou despesas agrupado por categoria com porcentagem"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Breakdown retornado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping("/by-category")
    public ResponseEntity<CategoryReportResponse> getByCategory(
            @Parameter(description = "Mês de referência (1-12)", example = "6")
            @RequestParam @Min(1) @Max(12) Integer month,
            @Parameter(description = "Ano de referência", example = "2026")
            @RequestParam Integer year,
            @Parameter(description = "Tipo da transação", example = "EXPENSE")
            @RequestParam TransactionType type) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(reportService.getByCategory(userId, month, year, type));
    }

    @Operation(
            summary = "Evolução mensal",
            description = "Retorna a evolução financeira mês a mês em um período. Meses sem transações retornam valores zero"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Evolução retornada com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    @GetMapping("/evolution")
    public ResponseEntity<EvolutionResponse> getEvolution(
            @Parameter(description = "Mês inicial (1-12)", example = "1")
            @RequestParam @Min(1) @Max(12) Integer startMonth,
            @Parameter(description = "Ano inicial", example = "2026")
            @RequestParam Integer startYear,
            @Parameter(description = "Mês final (1-12)", example = "6")
            @RequestParam @Min(1) @Max(12) Integer endMonth,
            @Parameter(description = "Ano final", example = "2026")
            @RequestParam Integer endYear) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(
                reportService.getEvolution(userId, startMonth, startYear, endMonth, endYear)
        );
    }
}