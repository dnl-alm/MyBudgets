CREATE TABLE transactions (
                              id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                              user_id     BIGINT         NOT NULL,
                              category_id BIGINT         NOT NULL,
                              amount      DECIMAL(15, 2) NOT NULL,
                              description VARCHAR(255),
                              date        DATE           NOT NULL,
                              type        ENUM('INCOME', 'EXPENSE') NOT NULL,
                              created_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT fk_transactions_user
                                  FOREIGN KEY (user_id) REFERENCES users(id)
                                      ON DELETE CASCADE,

                              CONSTRAINT fk_transactions_category
                                  FOREIGN KEY (category_id) REFERENCES categories(id)
                                      ON DELETE RESTRICT
);