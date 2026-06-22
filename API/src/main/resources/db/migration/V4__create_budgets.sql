CREATE TABLE budgets (
                         id           BIGINT AUTO_INCREMENT PRIMARY KEY,
                         user_id      BIGINT         NOT NULL,
                         category_id  BIGINT         NOT NULL,
                         limit_amount DECIMAL(15, 2) NOT NULL,
                         month        TINYINT        NOT NULL,
                         year         SMALLINT       NOT NULL,
                         created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

                         CONSTRAINT fk_budgets_user
                             FOREIGN KEY (user_id) REFERENCES users(id)
                                 ON DELETE CASCADE,

                         CONSTRAINT fk_budgets_category
                             FOREIGN KEY (category_id) REFERENCES categories(id)
                                 ON DELETE CASCADE,

                         CONSTRAINT uq_budget_category_period
                             UNIQUE (user_id, category_id, month, year)
);