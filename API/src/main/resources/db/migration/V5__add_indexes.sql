CREATE INDEX idx_transactions_user_date
    ON transactions(user_id, date);

CREATE INDEX idx_transactions_category
    ON transactions(category_id);

CREATE INDEX idx_budgets_user_period
    ON budgets(user_id, month, year);