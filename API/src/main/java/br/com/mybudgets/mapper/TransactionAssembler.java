package br.com.mybudgets.mapper;

import br.com.mybudgets.controller.TransactionController;
import br.com.mybudgets.domain.entity.Transaction;
import br.com.mybudgets.dto.response.TransactionResponse;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class TransactionAssembler
        extends RepresentationModelAssemblerSupport<Transaction, TransactionResponse> {

    private static final String BASE_URL = "/api/transactions";

    public TransactionAssembler() {
        super(TransactionController.class, TransactionResponse.class);
    }

    @Override
    public TransactionResponse toModel(Transaction transaction) {
        var category = new TransactionResponse.CategorySummary(
                transaction.getCategory().getId(),
                transaction.getCategory().getName(),
                transaction.getCategory().getColor(),
                transaction.getCategory().getType()
        );

        TransactionResponse response = new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getDate(),
                transaction.getType(),
                category,
                transaction.getCreatedAt()
        );

        String selfUrl = BASE_URL + "/" + transaction.getId();

        response.add(
                Link.of(selfUrl).withSelfRel(),
                Link.of(selfUrl).withRel("update"),
                Link.of(selfUrl).withRel("delete"),
                Link.of(BASE_URL).withRel("transactions")
        );

        return response;
    }
}