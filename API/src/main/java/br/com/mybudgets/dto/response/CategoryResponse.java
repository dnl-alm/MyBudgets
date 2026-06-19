package br.com.mybudgets.dto.response;

import br.com.mybudgets.domain.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.hateoas.server.core.Relation;

@Relation(collectionRelation = "categories", itemRelation = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse extends RepresentationModel<CategoryResponse> {
    private Long id;
    private String name;
    private String color;
    private TransactionType type;
}