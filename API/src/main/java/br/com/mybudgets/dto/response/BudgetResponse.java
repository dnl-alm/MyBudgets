package br.com.mybudgets.dto.response;

import br.com.mybudgets.domain.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.core.Relation;
import java.math.BigDecimal;

@Relation(collectionRelation = "budgets", itemRelation = "budget")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse extends RepresentationModel<BudgetResponse> {
    private Long id;
    private BigDecimal limitAmount;
    private BigDecimal realizedAmount;
    private Integer month;
    private Integer year;
    private CategorySummary category;

    public record CategorySummary(
            Long id,
            String name,
            String color,
            TransactionType type
    ) {}
}