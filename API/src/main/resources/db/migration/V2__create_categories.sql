CREATE TABLE categories (
                            id      BIGINT AUTO_INCREMENT PRIMARY KEY,
                            user_id BIGINT      NOT NULL,
                            name    VARCHAR(80) NOT NULL,
                            color   VARCHAR(7)  NOT NULL DEFAULT '#6366f1',
                            type    ENUM('INCOME', 'EXPENSE') NOT NULL,

                            CONSTRAINT fk_categories_user
                                FOREIGN KEY (user_id) REFERENCES users(id)
                                    ON DELETE CASCADE
);