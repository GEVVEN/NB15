CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);

-- 启用行级安全
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取
CREATE POLICY "Allow read access" ON reviews
    FOR SELECT USING (true);

-- 允许所有人插入
CREATE POLICY "Allow insert access" ON reviews
    FOR INSERT WITH CHECK (true);
