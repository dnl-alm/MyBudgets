package br.com.mybudgets.controller;

import br.com.mybudgets.domain.enums.TransactionType;
import br.com.mybudgets.dto.response.CategoryReportResponse;
import br.com.mybudgets.dto.response.EvolutionResponse;
import br.com.mybudgets.dto.response.SummaryResponse;
import br.com.mybudgets.security.SecurityUtils;
import br.com.mybudgets.service.ReportService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Validated
public class ReportController {

    private final ReportService reportService;
    private final SecurityUtils securityUtils;

    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse> getSummary(
            @RequestParam @Min(1) @Max(12) Integer month,
            @RequestParam Integer year) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(reportService.getSummary(userId, month, year));
    }

    @GetMapping("/by-category")
    public ResponseEntity<CategoryReportResponse> getByCategory(
            @RequestParam @Min(1) @Max(12) Integer month,
            @RequestParam Integer year,
            @RequestParam TransactionType type) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(reportService.getByCategory(userId, month, year, type));
    }

    @GetMapping("/evolution")
    public ResponseEntity<EvolutionResponse> getEvolution(
            @RequestParam @Min(1) @Max(12) Integer startMonth,
            @RequestParam Integer startYear,
            @RequestParam @Min(1) @Max(12) Integer endMonth,
            @RequestParam Integer endYear) {
        Long userId = securityUtils.getCurrentUserId();
        return ResponseEntity.ok(
                reportService.getEvolution(userId, startMonth, startYear, endMonth, endYear)
        );
    }
}