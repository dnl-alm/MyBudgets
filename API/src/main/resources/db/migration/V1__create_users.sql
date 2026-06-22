CREATE TABLE users (
                       id         BIGINT AUTO_INCREMENT PRIMARY KEY,
                       name       VARCHAR(100)  NOT NULL,
                       email      VARCHAR(150)  NOT NULL UNIQUE,
                       password   VARCHAR(255)  NOT NULL,
                       created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);