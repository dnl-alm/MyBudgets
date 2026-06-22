package br.com.mybudgets.dto.response;

import br.com.mybudgets.domain.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.core.Relation;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Relation(collectionRelation = "transactions", itemRelation = "transaction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse extends RepresentationModel<TransactionResponse> {

    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate date;
    private TransactionType type;
    private CategorySummary category;
    private LocalDateTime createdAt;

    public record CategorySummary(
            Long id,
            String name,
            String color,
            TransactionType type
    ) {}
}