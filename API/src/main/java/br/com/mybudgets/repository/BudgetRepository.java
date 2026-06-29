package br.com.mybudgets.repository;

import br.com.mybudgets.domain.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    @Query("""
        SELECT b FROM Budget b
        JOIN FETCH b.category
        WHERE b.user.id = :userId
        AND b.month = :month
        AND b.year = :year
    """)
    List<Budget> findAllByUserIdAndMonthAndYear(
            @Param("userId") Long userId,
            @Param("month") Integer month,
            @Param("year") Integer year
    );

    @Query("""
        SELECT b FROM Budget b
        JOIN FETCH b.category
        WHERE b.id = :id
        AND b.user.id = :userId
    """)
    Optional<Budget> findByIdAndUserId(
            @Param("id") Long id,
            @Param("userId") Long userId
    );

    boolean existsByUserIdAndCategoryIdAndMonthAndYear(
            Long userId, Long categoryId, Integer month, Integer year
    );
}