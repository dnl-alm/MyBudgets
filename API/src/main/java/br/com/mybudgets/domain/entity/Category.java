package br.com.mybudgets.domain.entity;

import br.com.mybudgets.domain.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 7)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;
}