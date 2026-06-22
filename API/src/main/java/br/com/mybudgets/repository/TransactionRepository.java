package br.com.mybudgets.repository;

import br.com.mybudgets.domain.entity.Transaction;
import br.com.mybudgets.domain.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>,
        JpaSpecificationExecutor<Transaction> {

    @Query(
            value = """
            SELECT t FROM Transaction t
            JOIN FETCH t.category
            WHERE t.user.id = :userId
        """,
            countQuery = """
            SELECT COUNT(t) FROM Transaction t
            WHERE t.user.id = :userId
        """
    )
    Page<Transaction> findAllByUserIdWithCategory(
            @Param("userId") Long userId,
            Pageable pageable
    );

    @Query("""
        SELECT t FROM Transaction t
        JOIN FETCH t.category
        WHERE t.id = :id
        AND t.user.id = :userId
    """)
    Optional<Transaction> findByIdAndUserIdWithCategory(
            @Param("id") Long id,
            @Param("userId") Long userId
    );

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user.id = :userId
        AND t.type = :type
        AND MONTH(t.date) = :month
        AND YEAR(t.date) = :year
    """)
    BigDecimal sumByUserIdAndTypeAndPeriod(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("month") int month,
            @Param("year") int year
    );
}