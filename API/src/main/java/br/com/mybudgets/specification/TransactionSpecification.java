package br.com.mybudgets.specification;

import br.com.mybudgets.domain.entity.Transaction;
import br.com.mybudgets.domain.enums.TransactionType;
import org.springframework.data.jpa.domain.Specification;

public class TransactionSpecification {

    private TransactionSpecification() {}

    public static Specification<Transaction> hasUser(Long userId) {
        return (root, query, cb) ->
                cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Transaction> hasMonth(Integer month) {
        return (root, query, cb) ->
                cb.equal(cb.function("MONTH", Integer.class, root.get("date")), month);
    }

    public static Specification<Transaction> hasYear(Integer year) {
        return (root, query, cb) ->
                cb.equal(cb.function("YEAR", Integer.class, root.get("date")), year);
    }

    public static Specification<Transaction> hasType(TransactionType type) {
        return (root, query, cb) ->
                cb.equal(root.get("type"), type);
    }

    public static Specification<Transaction> hasCategory(Long categoryId) {
        return (root, query, cb) ->
                cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Transaction> fetchCategory() {
        return (root, query, cb) -> {
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("category");
            }
            return cb.conjunction();
        };
    }
}