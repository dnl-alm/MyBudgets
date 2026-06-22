package br.com.mybudgets.mapper;

import br.com.mybudgets.controller.BudgetController;
import br.com.mybudgets.domain.entity.Budget;
import br.com.mybudgets.dto.response.BudgetResponse;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Component
public class BudgetAssembler
        extends RepresentationModelAssemblerSupport<Budget, BudgetResponse> {

    private static final String BASE_URL = "/api/budgets";

    public BudgetAssembler() {
        super(BudgetController.class, BudgetResponse.class);
    }

    @Override
    public BudgetResponse toModel(Budget budget) {
        return toModel(budget, BigDecimal.ZERO);
    }

    public BudgetResponse toModel(Budget budget, BigDecimal realizedAmount) {
        var category = new BudgetResponse.CategorySummary(
                budget.getCategory().getId(),
                budget.getCategory().getName(),
                budget.getCategory().getColor(),
                budget.getCategory().getType()
        );

        BudgetResponse response = new BudgetResponse(
                budget.getId(),
                budget.getLimitAmount(),
                realizedAmount,
                budget.getMonth(),
                budget.getYear(),
                category
        );

        String selfUrl = BASE_URL + "/" + budget.getId();

        response.add(
                Link.of(selfUrl).withSelfRel(),
                Link.of(selfUrl).withRel("update"),
                Link.of(selfUrl).withRel("delete"),
                Link.of(BASE_URL).withRel("budgets")
        );

        return response;
    }

    public CollectionModel<BudgetResponse> toCollectionModel(
            List<Budget> budgets,
            Map<Long, BigDecimal> realizedAmounts) {

        List<BudgetResponse> responses = budgets.stream()
                .map(budget -> toModel(
                        budget,
                        realizedAmounts.getOrDefault(budget.getId(), BigDecimal.ZERO)
                ))
                .toList();

        CollectionModel<BudgetResponse> collection = CollectionModel.of(responses);
        collection.add(Link.of(BASE_URL).withSelfRel());
        return collection;
    }
}